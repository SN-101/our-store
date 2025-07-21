let sports = 0
let books = 0
let home = 0
let electronics = 0
let beauty = 0
let fashion = 0
let courses = 0

const products = [
    {
        id: '1',
        name: 'هاتف ذكي متطور',
        price: 2500,
        originalPrice: 3000,
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: 'هاتف ذكي بتقنية متطورة، شاشة عالية الوضوح، كاميرا ممتازة، وبطارية تدوم طويلاً. مثالي للاستخدام اليومي والعمل.',
        specifications: [
            'شاشة 6.5 بوصة AMOLED',
            'ذاكرة 128 جيجابايت',
            'كاميرا 48 ميجابكسل',
            'بطارية 4000 مللي أمبير',
            'مقاوم للماء IP68',
            'معالج ثماني النواة'
        ],
        rating: 4.5,
        reviews: 150,
        inStock: true,
        featured: true,
        discount: 17
    },
    {
        id: '2',
        name: 'حقيبة يد أنيقة',
        price: 450,
        originalPrice: 600,
        image: 'https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg',
        images: [
            'https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg',
            'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'fashion',
        description: 'حقيبة يد عصرية مصنوعة من الجلد الطبيعي، مثالية للاستخدام اليومي والمناسبات الخاصة.',
        specifications: [
            'جلد طبيعي عالي الجودة',
            'مقاس متوسط مناسب للاستخدام اليومي',
            'متوفر بألوان متعددة',
            'ضمان لمدة سنة',
            'جيوب داخلية متعددة',
            'مقبض مريح'
        ],
        rating: 4.2,
        reviews: 85,
        inStock: true,
        featured: true,
        discount: 25
    },
    {
        id: '3',
        name: 'كتاب تطوير الذات',
        price: 120,
        image: 'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg',
        images: [
            'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg',
            'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'books',
        description: 'كتاب شامل لتطوير الذات وتحسين الحياة الشخصية والمهنية، مكتوب بأسلوب سهل ومفهوم.',
        specifications: [
            '300 صفحة',
            'غلاف فاخر',
            'باللغة العربية',
            'من تأليف خبير مختص',
            'يحتوي على تمارين عملية',
            'طباعة عالية الجودة'
        ],
        rating: 4.8,
        reviews: 200,
        inStock: true,
        featured: false
    },
    {
        id: '4',
        name: 'سماعة لاسلكية',
        price: 180,
        originalPrice: 250,
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: 'سماعة لاسلكية عالية الجودة مع تقنية إلغاء الضوضاء، مثالية للموسيقى والمكالمات.',
        specifications: [
            'تقنية بلوتوث 5.0',
            'بطارية تدوم 24 ساعة',
            'مقاومة للماء IPX4',
            'صوت عالي الجودة',
            'إلغاء الضوضاء النشط',
            'تصميم مريح للأذن'
        ],
        rating: 4.3,
        reviews: 120,
        inStock: true,
        featured: true,
        discount: 28
    },
    {
        id: '5',
        name: 'طقم أواني مطبخ',
        price: 350,
        image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'home',
        description: 'طقم أواني مطبخ كامل مصنوع من الستانلس ستيل عالي الجودة، مناسب لجميع أنواع الطبخ.',
        specifications: [
            'ستانلس ستيل 18/10',
            'مناسب لجميع أنواع المواقد',
            'سهل التنظيف',
            'ضمان 5 سنوات',
            'مقاوم للصدأ',
            'تصميم عملي وأنيق'
        ],
        rating: 4.6,
        reviews: 95,
        inStock: true,
        featured: false
    },
    {
        id: '6',
        name: 'حذاء رياضي مريح',
        price: 280,
        originalPrice: 350,
        image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'sports',
        description: 'حذاء رياضي مريح مناسب للجري والأنشطة الرياضية المختلفة، مصنوع من مواد عالية الجودة.',
        specifications: [
            'نعل مطاطي عالي الجودة',
            'خامة تسمح بالتهوية',
            'تصميم مريح للقدم',
            'متوفر بمقاسات مختلفة',
            'مقاوم للانزلاق',
            'مناسب للاستخدام اليومي'
        ],
        rating: 4.4,
        reviews: 180,
        inStock: true,
        featured: true,
        discount: 20
    },
    {
        id: '7',
        name: 'كريم مرطب للبشرة',
        price: 95,
        originalPrice: 120,
        image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'beauty',
        description: 'كريم مرطب طبيعي للبشرة، يحتوي على مكونات طبيعية مغذية ومرطبة.',
        specifications: [
            'مكونات طبيعية 100%',
            'مناسب لجميع أنواع البشرة',
            'خالي من المواد الكيميائية الضارة',
            'مرطب ومغذي',
            'سريع الامتصاص',
            'حجم 50 مل'
        ],
        rating: 4.7,
        reviews: 75,
        inStock: true,
        featured: false,
        discount: 21
    },
    {
        id: '8',
        name: 'لابتوب عالي الأداء',
        price: 4550,
        originalPrice: 5200,
        image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: 'لابتوب عالي الأداء مناسب للعمل والدراسة والألعاب، مع مواصفات متقدمة.',
        specifications: [
            'معالج Intel Core i7',
            'ذاكرة عشوائية 16 جيجابايت',
            'قرص صلب SSD 512 جيجابايت',
            'كارت رسوميات منفصل',
            'شاشة 15.6 بوصة Full HD',
            'نظام تشغيل Windows 11'
        ],
        rating: 4.6,
        reviews: 65,
        inStock: true,
        featured: true,
        discount: 13
    },
    {
        id: '9',
        name: 'فستان أنيق',
        price: 220,
        originalPrice: 280,
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'fashion',
        description: 'فستان أنيق مناسب للمناسبات الخاصة، مصنوع من أقمشة عالية الجودة.',
        specifications: [
            'قماش عالي الجودة',
            'تصميم عصري وأنيق',
            'متوفر بألوان متعددة',
            'سهل الغسيل والعناية',
            'مقاسات من S إلى XL',
            'مناسب للمناسبات الخاصة'
        ],
        rating: 4.3,
        reviews: 92,
        inStock: true,
        featured: false,
        discount: 21
    },
    {
        id: '10',
        name: 'مجموعة أدوات المطبخ',
        price: 180,
        image: 'https://images.pexels.com/photos/4226463/pexels-photo-4226463.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/4226463/pexels-photo-4226463.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/4226804/pexels-photo-4226804.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'home',
        description: 'مجموعة أدوات المطبخ الأساسية، تشمل جميع الأدوات اللازمة للطبخ اليومي.',
        specifications: [
            'مجموعة من 15 قطعة',
            'مصنوعة من الستانلس ستيل',
            'مقابض مريحة ومقاومة للحرارة',
            'سهلة التنظيف',
            'مناسبة للاستخدام اليومي',
            'ضمان سنة واحدة'
        ],
        rating: 4.4,
        reviews: 110,
        inStock: true,
        featured: false
    },
    {
        id: '11',
        name: 'كتاب الطبخ العربي',
        price: 85,
        image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1741231/pexels-photo-1741231.jpeg'
        ],
        category: 'books',
        description: 'كتاب شامل للطبخ العربي التقليدي، يحتوي على أكثر من 200 وصفة مختلفة.',
        specifications: [
            '400 صفحة',
            'أكثر من 200 وصفة',
            'صور ملونة للأطباق',
            'نصائح للطبخ المنزلي',
            'باللغة العربية',
            'غلاف صلب فاخر'
        ],
        rating: 4.9,
        reviews: 145,
        inStock: true,
        featured: true
    },
    {
        id: '12',
        name: 'كرة قدم احترافية',
        price: 150,
        originalPrice: 200,
        image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'sports',
        description: 'كرة قدم احترافية مصنوعة من الجلد الطبيعي، مناسبة للمباريات والتدريب.',
        specifications: [
            'جلد طبيعي عالي الجودة',
            'مقاس رسمي FIFA',
            'مناسبة للمباريات الرسمية',
            'متينة ومقاومة للاهتراء',
            'وزن قياسي',
            'تصميم كلاسيكي'
        ],
        rating: 4.5,
        reviews: 88,
        inStock: true,
        featured: false
    },
    {
        id: '13',
        name: 'تعلم بايثون بالكامل بطريقة بسيطة',
        price: 199.99,
        originalPrice: 650,
        image: 'files/id13/python.webp',
        images: [
            'files/id13/python.webp',
            'files/id13/python2.webp'
        ],
        category: 'courses',
        description: 'فيديوهات مباشرة للفصول الدراسية لشرح مفاهيم Python 3 بالتفصيل من مستوى المبتدئين إلى الخبراء.',
        specifications: [
            '114 ساعة من الفيديوهات عند الطلب',
            '37 مصدرًا قابلًا للتنزيل',
            'متاح على الهاتف المحمول والتلفزيون',
            'تعلم لغة بايثون بالتفصيل',
            'اللغة الإنجليزية'
        ],
        rating: 4.7,
        reviews: 600,
        inStock: true,
        featured: true,
        discount: 69
    },
    {
        id: '14',
        name: 'تعلم البرمجة الإبداعية باستخدام JavaScript الفانيليا',
        price: 149.99,
        originalPrice: 500,
        image: 'files/id14/js.webp',
        images: [
            'files/id14/js.webp',
            'files/id14/jsdrawing.webp'
        ],
        category: 'courses',
        description: 'دعونا نصنع الفن باستخدام الكود ونتعلم البرمجة الموجهة للكائنات باستخدام JavaScript البسيط في هذه العملية',
        specifications: [,
            'استكشف البرمجة الإبداعية باستخدام HTML وCSS وJavaScript',
            'تعلم الرسم باستخدام البرمجة',
            'اكتسب فهمًا عميقًا لتقنيات الرسم على لوحة HTML القماشية',
            'أنشئ مشروعًا فنيًا توليديًا متكاملًا',
            'اللغة الإنجليزية'
        ],
        rating: 4.7,
        reviews: 110,
        inStock: true,
        featured: false,
        discount: 70
    }
];

products.forEach(product => {
    switch (product.category) {
        case "sports":
            sports++;
            break;
        case "books":
            books++;
            break;
        case "home":
            home++;
            break;
        case "electronics":
            electronics++;
            break;
        case "beauty":
            beauty++;
            break;
        case "fashion":
            fashion++;
            break;
        case "courses":
            courses++;
            break;
        default:
            console.log(`New category ${product.category}`);
    }
});

// Sample data for the e-commerce site
const categories = [
    {
        id: 'electronics',
        name: 'إلكترونيات',
        icon: 'fas fa-laptop',
        count: electronics
    },
    {
        id: 'fashion',
        name: 'أزياء',
        icon: 'fas fa-tshirt',
        count: fashion
    },
    {
        id: 'home',
        name: 'منزل ومطبخ',
        icon: 'fas fa-home',
        count: home
    },
    {
        id: 'books',
        name: 'كتب',
        icon: 'fas fa-book',
        count: books
    },
    {
        id: 'sports',
        name: 'رياضة',
        icon: 'fas fa-dumbbell',
        count: sports
    },
    {
        id: 'beauty',
        name: 'تجميل',
        icon: 'fas fa-heart',
        count: beauty
    },
    {
        id: 'courses',
        name: 'دورات تدريبية',
        icon: 'fas fa-chalkboard-user',
        count: courses
    }
];

// Function to get products by category
function getProductsByCategory(categoryId) {
    return products.filter(product => product.category === categoryId);
}

// Function to get featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to search products
function searchProducts(query) {
    return products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
}

// Function to filter products
function filterProducts(filters) {
    let filteredProducts = [...products];

    // Filter by category
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
        filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
        filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice);
    }

    // Filter by rating
    if (filters.rating) {
        filteredProducts = filteredProducts.filter(product => product.rating >= filters.rating);
    }

    // Filter by in stock
    if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Search query
    if (filters.query) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(filters.query.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.query.toLowerCase())
        );
    }

    return filteredProducts;
}

// Function to sort products
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];

    switch (sortBy) {
        case 'price-low':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sortedProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        case 'featured':
            return sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        default:
            return sortedProducts;
    }
}

// Function to get related products
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];

    return products
        .filter(p => p.id !== productId && p.category === product.category)
        .slice(0, limit);
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }

    return stars;
}

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('ar-MA', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Function to format number to Arabic
function formatNumberToArabic(number) {
    return new Intl.NumberFormat('ar-MA').format(number);
}