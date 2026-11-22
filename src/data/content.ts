export type Language = 'vi' | 'en';

type Copy = {
  title: string; description: string; skip: string; home: string; menu: string;
  nav: Record<'about' | 'sectors' | 'products' | 'contact', string>;
  intro: string; headline: [string, string, string]; lead: string; explore: string;
  sectorTitle: string; sectorNames: [string, string, string, null]; building: string; planned: string;
  aboutTitle: string; aboutText: string; productTitle: string;
  productDescriptions: Record<'ganbarou' | 'jiayou', string>;
  soon: string; visit: (name: string) => string;
  founder: string; phone: string; copy: string; copied: string; manual: string;
};

export const copy: Record<Language, Copy> = {
  vi: {
    title: 'THADO GROUP | Thương hiệu và sản phẩm',
    description: 'Tìm hiểu THADO GROUP và hai nền tảng học ngoại ngữ đang được phát triển tại THADO EDU, Ganbarou và Jiayou.',
    skip: 'Đến nội dung chính', home: 'Trang chủ THADO GROUP', menu: 'Menu',
    nav: { about: 'Giới thiệu', sectors: 'Lĩnh vực', products: 'Sản phẩm', contact: 'Liên hệ' },
    intro: 'Thương hiệu mẹ', headline: ['Một tầm nhìn.', 'Nhiều lĩnh vực.', 'Giá trị dài lâu.'],
    lead: 'Khởi đầu từ giáo dục, THADO GROUP là thương hiệu mẹ của THADO EDU, nơi Ganbarou và Jiayou đang được phát triển cho người học tiếng Nhật và tiếng Trung.',
    explore: 'Khám phá sản phẩm', sectorTitle: 'Lĩnh vực phát triển',
    sectorNames: ['Giáo dục', 'Công nghệ', 'Truyền thông', null],
    building: 'Đang phát triển', planned: 'Định hướng',
    aboutTitle: 'Từ cái tên Thach Do.',
    aboutText: 'THADO mang tên người sáng lập Thach Do. Chúng tôi bắt đầu từ nhu cầu của người học ngoại ngữ và phát triển từng sản phẩm dưới một thương hiệu riêng. Về lâu dài, THADO hướng đến những lĩnh vực mới khi có nhu cầu thực tế và đủ năng lực để theo đuổi.',
    productTitle: 'Sản phẩm của THADO EDU',
    productDescriptions: { ganbarou: 'Nền tảng học tiếng Nhật.', jiayou: 'Nền tảng học tiếng Trung.' },
    soon: 'Sắp ra mắt', visit: name => 'Mở website ' + name,
    founder: 'Nhà sáng lập & CEO', phone: 'Điện thoại', copy: 'Sao chép số Zalo',
    copied: 'Đã sao chép số Zalo.', manual: 'Bạn có thể chọn và sao chép số 0354314095.'
  },
  en: {
    title: 'THADO GROUP | Our businesses and products',
    description: 'Discover THADO GROUP and the two language-learning platforms in development at THADO EDU, Ganbarou and Jiayou.',
    skip: 'Skip to content', home: 'THADO GROUP home', menu: 'Menu',
    nav: { about: 'About', sectors: 'Sectors', products: 'Products', contact: 'Contact' },
    intro: 'The parent brand', headline: ['One vision.', 'Multiple ventures.', 'A lasting legacy.'],
    lead: 'Starting with education, THADO GROUP is the parent brand of THADO EDU, where Ganbarou and Jiayou are taking shape for learners of Japanese and Chinese.',
    explore: 'Explore our products', sectorTitle: 'Our business areas',
    sectorNames: ['Education', 'Technology', 'Media', null],
    building: 'In development', planned: 'Planned',
    aboutTitle: 'A name rooted in Thach Do.',
    aboutText: 'THADO takes its name from its founder, Thach Do. We start with the needs of language learners and give each product its own brand. Over time, we plan to enter new fields where we see a real need and have the resources to meet it.',
    productTitle: 'Products from THADO EDU',
    productDescriptions: { ganbarou: 'A platform for learning Japanese.', jiayou: 'A platform for learning Chinese.' },
    soon: 'Coming soon', visit: name => 'Visit the ' + name + ' website',
    founder: 'Founder & CEO', phone: 'Phone', copy: 'Copy Zalo number',
    copied: 'Zalo number copied.', manual: 'Select and copy the number 0354314095.'
  }
};
