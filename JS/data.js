let sports = 0
let books = 0
let home = 0
let electronics = 0
let fashion = 0
let courses = 0

const products = [
    {
        id: '1',
        name: {
            ar: 'هاتف ذكي متطور',
            fr: 'Smartphone Avancé',
            en: 'Advanced Smartphone'
        },
        price: 2500,
        originalPrice: 3000,
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: {
            ar: 'هاتف ذكي بتقنية متطورة، شاشة عالية الوضوح، كاميرا ممتازة، وبطارية تدوم طويلاً. مثالي للاستخدام اليومي والعمل.',
            fr: 'Smartphone doté d’une technologie avancée, écran haute définition, excellent appareil photo et batterie longue durée. Idéal pour un usage quotidien et professionnel.',
            en: 'Smartphone with advanced technology, high-definition display, excellent camera, and long-lasting battery. Perfect for daily use and work.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.5,
        reviews: 150,
        inStock: true,
        featured: true,
        discount: 17
    },
    {
        id: '2',
        name: {
            ar: 'حقيبة يد أنيقة',
            en: 'Elegant Handbag',
            fr: 'Sac à main élégant'
        },
        price: 450,
        originalPrice: 600,
        image: 'https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg',
        images: [
            'https://images.pexels.com/photos/932401/pexels-photo-932401.jpeg',
            'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'fashion',
        description: {
            ar: 'حقيبة يد عصرية مصنوعة من الجلد الطبيعي، مثالية للاستخدام اليومي والمناسبات الخاصة.',
            en: 'A modern handbag made from genuine leather, perfect for daily use and special occasions.',
            fr: 'Un sac à main moderne en cuir véritable, parfait pour un usage quotidien et les occasions spéciales.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.2,
        reviews: 85,
        inStock: true,
        featured: true,
        discount: 25
    },
    {
        id: '3',
        name: {
            ar: 'فن اللامبالاة',
            en: 'The Subtle Art of Not Giving a F*ck',
            fr: 'L\'art subtil de s\'en foutre'
        },
        price: 25,
        image: 'files/id3/img1.webp',
        images: [
            'files/id3/img1.webp',
            'files/id3/img2.webp',
            'files/id3/img3.webp'
        ],
        category: 'books',
        description: {
            ar: 'كتاب فن اللامبالاة للكاتب الأمريكي مارك مانسون هو دليل فلسفي نفسي يساعد القارئ على فهم الحياة بواقعية وتجاوز الضغوط العاطفية. يركز على مبدأ بسيط: لا يمكننا أن نعطي اهتمامًا لكل شيء، لذلك يجب أن نختار بعناية ما نهتم به فعلًا.',
            en: 'The Subtle Art of Not Giving a F*ck by Mark Manson is a philosophical self-help guide that helps readers understand life realistically and overcome emotional pressures. It emphasizes a simple principle: we cannot care about everything, so we must carefully choose what really matters.',
            fr: 'L\'art subtil de s\'en foutre de Mark Manson est un guide philosophique et psychologique qui aide le lecteur à comprendre la vie de manière réaliste et à surmonter les pressions émotionnelles. Il met l\'accent sur un principe simple : on ne peut pas se soucier de tout, il faut donc choisir attentivement ce qui compte vraiment.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.4,
        reviews: 150,
        inStock: true,
        featured: false
    },
    {
        id: '4',
        name: {
            ar: 'سماعة لاسلكية',
            en: 'Wireless Headphones',
            fr: 'Casque sans fil'
        },
        price: 180,
        originalPrice: 250,
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: {
            ar: 'سماعة لاسلكية عالية الجودة مع تقنية إلغاء الضوضاء، مثالية للموسيقى والمكالمات.',
            en: 'High-quality wireless headphones with noise cancellation technology, perfect for music and calls.',
            fr: 'Casque sans fil de haute qualité avec technologie de réduction du bruit, parfait pour la musique et les appels.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.3,
        reviews: 120,
        inStock: true,
        featured: false,
        discount: 28
    },
    {
        id: '5',
        name: { ar: 'طقم أواني مطبخ', en: 'Kitchen Cookware Set', fr: 'Ensemble d\'ustensiles de cuisine' },
        price: 350,
        image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/4226796/pexels-photo-4226796.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'home',
        description: {
            ar: 'طقم أواني مطبخ كامل مصنوع من الستانلس ستيل عالي الجودة، مناسب لجميع أنواع الطبخ.',
            en: 'Complete kitchen cookware set made of high-quality stainless steel, suitable for all types of cooking.',
            fr: 'Ensemble complet d\'ustensiles de cuisine en acier inoxydable de haute qualité, adapté à tous les types de cuisson.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.6,
        reviews: 95,
        inStock: true,
        featured: false
    },
    {
        id: '6',
        name: { ar: 'حذاء رياضي مريح', en: 'Comfortable Sports Shoes', fr: 'Chaussures de sport confortables' },
        price: 280,
        originalPrice: 350,
        image: 'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'sports',
        description: {
            ar: 'حذاء رياضي مريح مناسب للجري والأنشطة الرياضية المختلفة، مصنوع من مواد عالية الجودة.',
            en: 'Comfortable sports shoes suitable for running and various sports activities, made from high-quality materials.',
            fr: 'Chaussures de sport confortables adaptées à la course et aux diverses activités sportives, fabriquées à partir de matériaux de haute qualité.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.4,
        reviews: 180,
        inStock: true,
        featured: false,
        discount: 20
    },
    {
        id: '7',
        name: { ar: 'لابتوب عالي الأداء', en: 'High-Performance Laptop', fr: 'Ordinateur portable haute performance' },
        price: 4550,
        originalPrice: 5200,
        image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'electronics',
        description: {
            ar: 'لابتوب عالي الأداء مناسب للعمل والدراسة والألعاب، مع مواصفات متقدمة.',
            en: 'High-performance laptop suitable for work, study, and gaming, with advanced specifications.',
            fr: 'Ordinateur portable haute performance adapté au travail, aux études et aux jeux, avec des spécifications avancées.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.6,
        reviews: 65,
        inStock: true,
        featured: true,
        discount: 13
    },
    {
        id: '8',
        name: { ar: 'فستان أنيق', en: 'Elegant Dress', fr: 'Robe élégante' },
        price: 220,
        originalPrice: 280,
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'fashion',
        description: {
            ar: 'فستان أنيق مناسب للمناسبات الخاصة، مصنوع من أقمشة عالية الجودة.',
            en: 'Elegant dress suitable for special occasions, made from high-quality fabrics.',
            fr: 'Robe élégante adaptée aux occasions spéciales, fabriquée à partir de tissus de haute qualité.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.3,
        reviews: 92,
        inStock: true,
        featured: false,
        discount: 21
    },
    {
        id: '9',
        name: { ar: 'مجموعة أدوات المطبخ', en: 'Kitchen Tool Set', fr: 'Ensemble d\'ustensiles de cuisine' },
        price: 180,
        image: 'https://images.pexels.com/photos/4226463/pexels-photo-4226463.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/4226463/pexels-photo-4226463.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/4226804/pexels-photo-4226804.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'home',
        description: {
            ar: 'مجموعة أدوات المطبخ الأساسية، تشمل جميع الأدوات اللازمة للطبخ اليومي.',
            en: 'Essential kitchen tool set, including all utensils needed for daily cooking.',
            fr: 'Ensemble d\'ustensiles de cuisine essentiels, comprenant tous les outils nécessaires à la cuisine quotidienne.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.4,
        reviews: 110,
        inStock: true,
        featured: false
    },
    {
        id: '10',
        name: { ar: 'لماذا ننام', en: 'Why We Sleep', fr: 'Pourquoi nous dormons' },
        price: 25,
        image: 'files/id11/img3.webp',
        images: [
            'files/id11/img3.webp',
            'files/id11/img2.webp',
            'files/id11/img1.webp'
        ],
        category: 'books',
        description: {
            ar: 'كتاب لماذا ننام هو عمل علمي شهير من تأليف ماثيو ووكر، يشرح النوم وأثره على صحتنا.',
            en: 'The book "Why We Sleep" by Matthew Walker is a famous scientific work explaining sleep and its impact on our health.',
            fr: 'Le livre "Pourquoi nous dormons" de Matthew Walker est un ouvrage scientifique célèbre expliquant le sommeil et son impact sur notre santé.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.5,
        reviews: 147,
        inStock: true,
        featured: true
    },
    {
        id: '11',
        name: { ar: 'كرة قدم احترافية', en: 'Professional Football', fr: 'Ballon de football professionnel' },
        price: 150,
        originalPrice: 200,
        image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
            'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        category: 'sports',
        description: {
            ar: 'كرة قدم احترافية مصنوعة من الجلد الطبيعي، مناسبة للمباريات والتدريب.',
            en: 'Professional football made of natural leather, suitable for matches and training.',
            fr: 'Ballon de football professionnel en cuir naturel, adapté aux matchs et à l\'entraînement.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.5,
        reviews: 88,
        inStock: true,
        featured: false
    },
    {
        id: '12',
        name: { ar: 'تعلم بايثون بالكامل بطريقة بسيطة', en: 'Learn Python Completely', fr: 'Apprendre Python complètement' },
        price: 200,
        originalPrice: 650,
        image: 'files/id13/python.webp',
        images: [
            'files/id13/python.webp',
            'files/id13/python2.webp'
        ],
        category: 'courses',
        description: {
            ar: 'فيديوهات مباشرة لشرح مفاهيم Python 3 بالتفصيل من المبتدئين إلى الخبراء.',
            en: 'Live videos explaining Python 3 concepts in detail from beginners to experts.',
            fr: 'Vidéos en direct expliquant les concepts de Python 3 en détail, des débutants aux experts.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.7,
        reviews: 600,
        inStock: true,
        featured: true,
        discount: 69
    },
    {
        id: '13',
        name: { ar: 'تعلم البرمجة الإبداعية باستخدام JavaScript الفانيليا', en: 'Creative Coding with Vanilla JS', fr: 'Programmation créative avec JavaScript vanilla' },
        price: 150,
        originalPrice: 500,
        image: 'files/id14/js.webp',
        images: [
            'files/id14/js.webp',
            'files/id14/jsdrawing.webp'
        ],
        category: 'courses',
        description: {
            ar: 'تعلم البرمجة الموجهة للكائنات والرسم باستخدام JavaScript الفانيليا.',
            en: 'Learn object-oriented programming and drawing using vanilla JavaScript.',
            fr: 'Apprenez la programmation orientée objet et le dessin avec JavaScript vanilla.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.7,
        reviews: 110,
        inStock: true,
        featured: false,
        discount: 70
    },
    {
        id: '14',
        name: { ar: 'دورة التسويق الرقمي', en: 'Digital Marketing Course', fr: 'Cours de marketing digital' },
        price: 45,
        image: 'files/id15/img1.webp',
        images: [
            'files/id15/img1.webp',
            'files/id15/img2.webp'
        ],
        category: 'courses',
        description: {
            ar: 'استراتيجية التسويق الرقمي، التسويق عبر وسائل التواصل الاجتماعي، تحسين محركات البحث، ChatGPT.',
            en: 'Digital marketing strategy, social media marketing, SEO, ChatGPT.',
            fr: 'Stratégie de marketing digital, marketing sur les réseaux sociaux, SEO, ChatGPT.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.7,
        reviews: 310,
        inStock: true,
        featured: false
    },
    {
        id: '15',
        name: { ar: 'دورة الماجستير في اللغة الإنجليزية', en: 'Master English Course', fr: 'Cours de maîtrise en anglais' },
        price: 24,
        originalPrice: 120,
        image: 'files/id16/img1.webp',
        images: [
            'files/id16/img1.webp',
            'files/id16/img2.webp'
        ],
        category: 'courses',
        description: {
            ar: 'دورة لغة إنجليزية كاملة تشمل القواعد والتحدث والنطق والكتابة.',
            en: 'Complete English course covering grammar, speaking, pronunciation, and writing.',
            fr: 'Cours complet d\'anglais couvrant la grammaire, la conversation, la prononciation et l\'écriture.'
        },
        specifications: {
            ar: [
                'ستانلس ستيل 18/10',
                'مناسب لجميع أنواع المواقد',
                'سهل التنظيف',
                'ضمان 5 سنوات',
                'مقاوم للصدأ',
                'تصميم عملي وأنيق'
            ],
            en: [
                '18/10 Stainless Steel',
                'Suitable for all types of stoves',
                'Easy to clean',
                '5-year warranty',
                'Rust-resistant',
                'Practical and elegant design'
            ],
            fr: [
                'Acier inoxydable 18/10',
                'Convient à tous types de cuisinières',
                'Facile à nettoyer',
                'Garantie 5 ans',
                'Résistant à la rouille',
                'Design pratique et élégant'
            ]
        },
        rating: 4.8,
        reviews: 450,
        inStock: true,
        featured: true,
        discount: 80
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
        name: { ar: 'إلكترونيات', en: 'Electronics', fr: 'Électronique' },
        icon: 'fas fa-laptop',
        count: electronics
    },
    {
        id: 'fashion',
        name: { ar: 'أزياء', en: 'Fashion', fr: 'Mode' },
        icon: 'fas fa-tshirt',
        count: fashion
    },
    {
        id: 'home',
        name: { ar: 'منزل ومطبخ', en: 'Home & Kitchen', fr: 'Maison & Cuisine' },
        icon: 'fas fa-home',
        count: home
    },
    {
        id: 'books',
        name: { ar: 'كتب PDF', en: 'PDF Books', fr: 'Livres PDF' },
        icon: 'fas fa-book',
        count: books
    },
    {
        id: 'sports',
        name: { ar: 'رياضة', en: 'Sports', fr: 'Sports' },
        icon: 'fas fa-dumbbell',
        count: sports
    },
    {
        id: 'courses',
        name: { ar: 'دورات تدريبية', en: 'Courses', fr: 'Cours' },
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

function filterProducts(filters) {
    let filteredProducts = [...products];

    // التصنيف
    if (filters.category && filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }

    // السعر الأدنى
    const min = parseFloat(filters.minPrice);
    if (!isNaN(min)) {
        filteredProducts = filteredProducts.filter(product => product.price >= min);
    }

    // السعر الأقصى
    const max = parseFloat(filters.maxPrice);
    if (!isNaN(max)) {
        filteredProducts = filteredProducts.filter(product => product.price <= max);
    }

    // التقييم
    if (filters.rating) {
        const rating = parseFloat(filters.rating);
        if (!isNaN(rating)) {
            filteredProducts = filteredProducts.filter(product => product.rating >= rating);
        }
    }

    // التوفر
    if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // البحث النصي (يدعم ar, en, fr)
    if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredProducts = filteredProducts.filter(product => {
            // البحث في الاسم (جميع اللغات)
            const name = product.name;
            const nameMatch = typeof name === 'object'
                ? Object.values(name).some(val => String(val).toLowerCase().includes(query))
                : String(name).toLowerCase().includes(query);

            // البحث في الوصف (جميع اللغات)
            const description = product.description;
            const descMatch = typeof description === 'object'
                ? Object.values(description).some(val => String(val).toLowerCase().includes(query))
                : String(description).toLowerCase().includes(query);

            // يمكنك إضافة حقول أخرى مثل tags, categoryName...
            return nameMatch || descMatch;
        });
    }

    return filteredProducts;
}

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
    const lang = languageManager.currentLang; // 'ar', 'en', 'fr'
    const locale = lang === 'ar' ? 'ar-MA' : (lang === 'fr' ? 'fr-FR' : 'en-US');
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatNumberToArabic(number) {
    const lang = languageManager.currentLang;
    const locale = lang === 'ar' ? 'ar-MA' : (lang === 'fr' ? 'fr-FR' : 'en-US');
    return new Intl.NumberFormat(locale).format(number);
}

window.products = products;
window.categories = categories;