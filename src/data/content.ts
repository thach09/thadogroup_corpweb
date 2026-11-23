export type Language = 'vi' | 'en';

type Copy = {
  title: string; description: string; skip: string; home: string; menu: string;
  nav: Record<'about' | 'sectors' | 'products' | 'contact', string>;
  intro: string; headline: [string, string, string]; lead: string; explore: string;
  sectorTitle: string; sectorNames: [string, string, string, null]; building: string; planned: string;
  aboutTitle: string; aboutText: string; productTitle: string;
  productDescriptions: Record<'ganbarou' | 'jiayou', string>;
  soon: string; visit: (name: string) => string;
  founder: string; phone: string; email: string; copy: string; copied: string; manual: string;
  zaloLabel: string;
};

export const copy: Record<Language, Copy> = {
  vi: {
    title: 'THADO GROUP | Thương hiệu và sản phẩm',
    description: 'Tìm hiểu THADO GROUP và hai nền tảng học ngoại ngữ đang được phát triển tại THADO EDU, Ganbarou và Jiayou.',
    skip: 'Đến nội dung chính', home: 'Trang chủ THADO GROUP', menu: 'Menu',
    nav: { about: 'Về THADO', sectors: 'Lĩnh vực', products: 'Sản phẩm', contact: 'Liên hệ' },
    intro: 'HỆ SINH THÁI ĐA LĨNH VỰC', headline: ['Một tầm nhìn', 'Nhiều lĩnh vực', 'Giá trị dài lâu'],
    lead: 'Khởi đầu từ giáo dục với THADO EDU, THADO GROUP xây dựng và phát triển các nền tảng học ngoại ngữ thế hệ mới như Ganbarou và Jiayou, định hướng mở rộng đa lĩnh vực và kiến tạo giá trị dài lâu.',
    explore: 'Khám phá sản phẩm', sectorTitle: 'Lĩnh vực phát triển',
    sectorNames: ['Giáo dục', 'Công nghệ', 'Truyền thông', null],
    building: 'Đang phát triển', planned: 'Định hướng',
    aboutTitle: 'Về THADO',
    aboutText: 'Khởi nguồn từ tên nhà sáng lập Thach Do, THADO GROUP được xây dựng với khát vọng kiến tạo các giải pháp hữu ích cho cộng đồng. Bắt đầu từ giáo dục ngoại ngữ với từng sản phẩm mang nhận diện chuyên biệt, chúng tôi tập trung giải quyết nhu cầu thực tế của người học và kiên định mở rộng sang các lĩnh vực mới khi hội tụ đủ nguồn lực và giá trị dài lâu.',
    productTitle: 'Sản phẩm của THADO EDU',
    productDescriptions: { ganbarou: 'Nền tảng học tiếng Nhật.', jiayou: 'Nền tảng học tiếng Trung.' },
    soon: 'Sắp ra mắt', visit: name => 'Mở website ' + name,
    founder: 'Nhà sáng lập & CEO', phone: 'Điện thoại', email: 'Email', copy: 'Sao chép số Zalo',
    copied: 'Đã sao chép số Zalo.', manual: 'Bạn có thể chọn và sao chép số 0354314095.',
    zaloLabel: 'Liên hệ qua Zalo'
  },
  en: {
    title: 'THADO GROUP | Our businesses and products',
    description: 'Discover THADO GROUP and the two language-learning platforms in development at THADO EDU, Ganbarou and Jiayou.',
    skip: 'Skip to content', home: 'THADO GROUP home', menu: 'Menu',
    nav: { about: 'About THADO', sectors: 'Sectors', products: 'Products', contact: 'Contact' },
    intro: 'MULTI-SECTOR ECOSYSTEM', headline: ['One vision', 'Multiple ventures', 'A lasting legacy'],
    lead: 'Starting in education with THADO EDU, THADO GROUP builds next-generation learning platforms like Ganbarou and Jiayou, expanding across sectors with a focus on enduring value.',
    explore: 'Explore our products', sectorTitle: 'Our business areas',
    sectorNames: ['Education', 'Technology', 'Media', null],
    building: 'In development', planned: 'Planned',
    aboutTitle: 'About THADO',
    aboutText: 'Rooted in the name of founder Thach Do, THADO GROUP was established to create meaningful value for society. Beginning in language education with distinct, purposeful products, we focus on real learner needs while strategically preparing to enter new sectors where we can deliver lasting impact.',
    productTitle: 'Products from THADO EDU',
    productDescriptions: { ganbarou: 'A platform for learning Japanese.', jiayou: 'A platform for learning Chinese.' },
    soon: 'Coming soon', visit: name => 'Visit the ' + name + ' website',
    founder: 'Founder & CEO', phone: 'Phone', email: 'Email', copy: 'Copy Zalo number',
    copied: 'Zalo number copied.', manual: 'Select and copy the number 0354314095.',
    zaloLabel: 'Contact via Zalo'
  }
};
