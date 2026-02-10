const DB = require("../config/datasource");
const specialistRepo = () => DB.getRepository("Specialist");
const platformFeeRepo = () => DB.getRepository("PlatformFee");

// --- Helper: Generate Slug ---
const createSlug = (title) => {
  if (!title) return `service-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();
};

// --- Helper: Calculate Pricing ---
async function calculatePricing(basePrice) {
  if (basePrice === undefined || basePrice === null || basePrice === "") {
    return { platform_fee: 0, final_price: 0 };
  }

  const priceNum = Number(basePrice);
  const fee = await platformFeeRepo()
    .createQueryBuilder("pf")
    .where(":price >= pf.min_value AND :price <= pf.max_value", {
      price: priceNum,
    })
    .getOne();

  if (!fee) {
    return { platform_fee: 0, final_price: priceNum };
  }

  const platformFee = (priceNum * Number(fee.platform_fee_percentage)) / 100;

  return {
    platform_fee: platformFee,
    final_price: priceNum + platformFee,
  };
}

// --- Controllers ---

exports.getAllSpecialists = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const qb = specialistRepo().createQueryBuilder("s");

    if (status === "draft") qb.andWhere("s.is_draft = :isDraft", { isDraft: true });
    if (status === "published") qb.andWhere("s.is_draft = :isDraft", { isDraft: false });

    if (search) {
      qb.andWhere("s.title ILIKE :search", { search: `%${search}%` });
    }

    qb.orderBy("s.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    // Map 'price' back to 'base_price' for the frontend
    const mappedData = data.map(item => ({
        ...item,
        base_price: item.price // Frontend expects base_price
    }));

    res.json({
      data: mappedData,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getSpecialistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const specialist = await specialistRepo().findOneBy({ id });
    
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    // Ensure frontend gets 'base_price'
    const responseData = {
        ...specialist,
        base_price: specialist.price
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
};

exports.createSpecialist = async (req, res, next) => {
  try {
    // 1. Validate Input
    if (req.body.base_price === undefined || req.body.base_price === null) {
        return res.status(400).json({ message: "base_price is required" });
    }

    const pricing = await calculatePricing(req.body.base_price);
    const slug = createSlug(req.body.title || "service");

    // 2. Map 'base_price' (input) -> 'price' (Entity Property)
    const specialist = specialistRepo().create({
      ...req.body,
      slug: slug,
      price: req.body.base_price, // <--- IMPORTANT: Mapping to 'price' property
      platform_fee: pricing.platform_fee,
      final_price: pricing.final_price,
      is_draft: true,
    });

    const result = await specialistRepo().save(specialist);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.updateSpecialist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const specialist = await specialistRepo().findOneBy({ id });

    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    let updates = { ...req.body };

    // 1. Handle Price Update
    if (req.body.base_price !== undefined && req.body.base_price !== null) {
      const pricing = await calculatePricing(req.body.base_price);
      
      updates.price = req.body.base_price; // <--- IMPORTANT: Mapping to 'price' property
      updates.platform_fee = pricing.platform_fee;
      updates.final_price = pricing.final_price;
    }

    // 2. Handle Title/Slug Update
    if (req.body.title && req.body.title !== specialist.title) {
        updates.slug = createSlug(req.body.title);
    }

    // 3. Cleanup: Remove 'base_price' from updates object to avoid confusion
    // (TypeORM might ignore it, but safe to remove)
    delete updates.base_price; 

    specialistRepo().merge(specialist, updates);
    const updated = await specialistRepo().save(specialist);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.publishSpecialist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await specialistRepo().update(id, { is_draft: false });
    if (result.affected === 0) return res.status(404).json({ message: "Specialist not found" });
    res.json({ message: "Specialist published successfully" });
  } catch (error) {
    next(error);
  }
};