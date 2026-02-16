const DB = require("../config/datasource");
const specialistRepo = DB.getRepository("Specialist");
const platformFeeRepo = DB.getRepository("PlatformFee");

const createSlug = (title) => {
  if (!title) return `service-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();
};

async function calculatePricing(basePrice) {
  if (basePrice === undefined || basePrice === null || basePrice === "") {
    return { platform_fee: 0, final_price: 0 };
  }

  const priceNum = Number(basePrice);
  
  const fee = await platformFeeRepo
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

exports.getAllSpecialists = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const qb = specialistRepo.createQueryBuilder("s");

    if (status === "draft") qb.andWhere("s.is_draft = :isDraft", { isDraft: true });
    if (status === "published") qb.andWhere("s.is_draft = :isDraft", { isDraft: false });

    if (search) {
      qb.andWhere("s.title ILIKE :search", { search: `%${search}%` });
    }

    qb.orderBy("s.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    // Ensure we return 'base_price' correctly for the frontend
    const mappedData = data.map(item => ({
        ...item,
        base_price: item.base_price // Changed from item.price
    }));

    res.json({
      data: mappedData,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get All Error:", error);
    res.status(500).json({ message: "Error fetching specialists" });
  }
};

exports.getSpecialistById = async (req, res) => {
  try {
    const { id } = req.params;
    const specialist = await specialistRepo.findOneBy({ id });
    
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    res.json(specialist); // The object should already have base_price
  } catch (error) {
    console.error("Get One Error:", error);
    res.status(500).json({ message: "Error fetching specialist" });
  }
};

exports.createSpecialist = async (req, res) => {
  try {
    const { 
        title, description, duration_days, base_price, offerings, 
        cover_image, gallery_image_1, gallery_image_2 
    } = req.body;

    const safePrice = base_price ? Number(base_price) : 0;
    const pricing = await calculatePricing(safePrice);
    const slug = createSlug(title);

    // FIXED: Changed 'price' to 'base_price' to match DB column
    const newSpecialist = specialistRepo.create({
      title,
      slug,
      description,
      duration_days: Number(duration_days || 1),
      offerings: offerings || [],
      
      base_price: safePrice,
      platform_fee: pricing.platform_fee,
      final_price: pricing.final_price,
      
      cover_image: cover_image || "",
      gallery_image_1: gallery_image_1 || "",
      gallery_image_2: gallery_image_2 || "",
      is_draft: true, 
    });

    const result = await specialistRepo.save(newSpecialist);
    res.status(201).json(result);

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: "Error creating specialist", error: error.message });
  }
};

exports.updateSpecialist = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
        title, description, duration_days, base_price, offerings,
        cover_image, gallery_image_1, gallery_image_2 
    } = req.body;

    const specialist = await specialistRepo.findOneBy({ id });
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    // Updates
    if (title) {
        specialist.title = title;
        if (title !== specialist.title) specialist.slug = createSlug(title);
    }
    if (description !== undefined) specialist.description = description;
    if (duration_days) specialist.duration_days = Number(duration_days);
    if (offerings) specialist.offerings = offerings;

    // FIXED: Changed 'price' to 'base_price' here as well
    if (base_price !== undefined && base_price !== null) {
      const pricing = await calculatePricing(base_price);
      specialist.base_price = Number(base_price); // <--- ERROR WAS HERE
      specialist.platform_fee = pricing.platform_fee;
      specialist.final_price = pricing.final_price;
    }

    // Image Updates
    if (cover_image !== undefined) specialist.cover_image = cover_image;
    if (gallery_image_1 !== undefined) specialist.gallery_image_1 = gallery_image_1;
    if (gallery_image_2 !== undefined) specialist.gallery_image_2 = gallery_image_2;

    const updated = await specialistRepo.save(specialist);
    res.json(updated);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Error updating specialist", error: error.message });
  }
};

exports.publishSpecialist = async (req, res) => {
  try {
    const { id } = req.params;
    const specialist = await specialistRepo.findOneBy({ id });
    if (!specialist) return res.status(404).json({ message: "Specialist not found" });

    specialist.is_draft = false;
    await specialistRepo.save(specialist);
    
    res.json({ message: "Specialist published successfully" });
  } catch (error) {
    console.error("Publish Error:", error);
    res.status(500).json({ message: "Error publishing specialist" });
  }
};