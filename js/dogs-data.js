/* ==========================================================
   dogs-data.js – EDIT THIS FILE to change your dogs.

   Each dog has:
     id          unique, lowercase, no spaces
     name        shown as the card title
     breed       shown under the name
     status      small badge, e.g. "Ready for rehoming" (optional)
     tags        any of: "best-seller", "recommended", "puppy"
                 (use [] for no tags)
     description short text shown on the card
     highlights  (optional) list of { title, text } shown when a
                 dog is tapped, like the points on your flyer
     care        (optional) short checklist shown when a dog is
                 tapped, e.g. "Complete deworming"
     images      list of image files in images/dogs/
                 The first image is the card photo; all of them
                 show when someone taps the dog.

   Leave out "highlights" and "care" for a dog and that part
   simply won't show.
   ========================================================== */

const DOGS = [
  {
    id: "king",
    name: "King",
    breed: "Parti Silver Teacup Poodle",
    status: "Ready for release anytime",
    tags: ["recommended"],
    description:
      "A charming little gentleman with a beautiful Parti Silver coat! A special companion with elegance, charm, and personality.",
    highlights: [
      { title: "Young Adult", text: "10 Months Old" },
    ],
    care: ["Complete 6-in-1 Vaccination", "Administered by a Licensed Veterinarian", "PCCI Papers On Hand"],
    images: ["images/dogs/king-desc.jpg", "images/dogs/king-2.jpg", "images/dogs/king-3.jpg", "images/dogs/king-4.jpg", "images/dogs/king-5.jpg"],
  },
  {
    id: "prince",
    name: "Prince",
    breed: "Rare Parti Silver Toy Poodle",
    tags: ["puppy", "recommended"],
    description:
      "A rare beauty in a fluffy little package! Meet Prince, our adorable Parti Silver Poodle with a charming teddy bear look. A special little gentleman waiting for his forever loving family.",
    highlights: [
      { title: "Puppy", text: "3 Months Old" },
      { title: "Rare", text: "Parti Silver Color" },
    ],
    care: ["Complete 6-in-1 Vaccination", "Complete Deworming", "PCCI Papers on Hand"],
    images: ["images/dogs/prince-1.jpg", "images/dogs/prince-2.jpg", "images/dogs/prince-3.jpg", "images/dogs/prince-4.jpg"],
  },
  {
    id: "honet",
    name: "Honet",
    breed: "Red Toy Poodle",
    status: "Ready for release anytime",
    tags: ["puppy", "recommended"],
    description:
      "Meet Honet, our adorable Red Toy Poodle with beautiful white markings and an irresistibly charming appearance. A sweet little companion with a lovely personality, raised with care and love.",
    highlights: [
      { title: "Puppy", text: "4 Months Old" },
      { title: "Color", text: "Red with White Markings" },
    ],
    care: ["Complete 6-in-1 Vaccine"],
    images: ["images/dogs/honet-1.jpg", "images/dogs/honet-2.jpg", "images/dogs/honet-3.jpg", "images/dogs/honet-4.jpg"],
  },
  {
    id: "pepper",
    name: "Pepper",
    breed: "Toy Poodle",
    tags: ["recommended"],
    description:
      "Meet Pepper, our handsome male Toy Poodle with a beautiful, rich-colored coat and imported lineage. A charming little gentleman with an adorable appearance, carefully raised with love and attention.",
    highlights: [
      { title: "Male", text: "Toy Poodle" },
      { title: "Imported", text: "Lineage" },
    ],
    care: ["Complete 6-in-1 Vaccine", "PCCI Papers on Hand"],
    images: ["images/dogs/pepper-1.jpg", "images/dogs/pepper-2.jpg", "images/dogs/pepper-3.jpg"],
  },

    {
    id: "polo",
    name: "Polo",
    breed: "Male Deep Red Toy Poodle",
    status: "Ready for release anytime",
    tags: [],
    description:
      "Meet Polo, a charming Deep Red Toy Poodle with a beautiful rich coat, adorable teddy-bear appearance, and an impressive imported background. A wonderful addition for a family looking for a lovely Toy Poodle companion.",
    highlights: [
      { title: "Male", text: "Toy Poodle" },
      { title: "Deep Red", text: "Color" },
      { title: "Both Parents", text: "Imported" },
    ],
    care: ["Complete 4x 6-in-1 Vaccination", "Complete Deworming", "PCCI Papers"],
    images: ["images/dogs/polo-1.jpg", "images/dogs/polo-2.jpg", "images/dogs/polo-3.jpg"],
  },


  {
    id: "enzo",
    name: "Enzo",
    breed: "Deep Red Toy Poodle",
    tags: [],
    description:
      "Our handsome Vietnam-imported little gentleman! A charming little prince with imported lineage and an irresistible doll-like appearance! 👑",
    highlights: [
      { title: "Male", text: "5 Months Old" },
      { title: "Gorgeous", text: "Deep Red Coat" },
      { title: "Adorable", text: "Doll Face" },
    ],
    care: ["Complete Vaccination", "Papers Available"],
    images: ["images/dogs/enzo-desc.jpg", "images/dogs/enzo-1.jpg", "images/dogs/enzo-3.jpg", "images/dogs/enzo-2.jpg"],
  },
  {
    id: "cherry",
    name: "Cherry",
    breed: "Red Toy Poodle",
    status: "Ready for release anytime",
    tags: [],
    description:
      "A lovely little princess with a beautiful red coat and adorable charm! Waiting for her forever loving family!",
    highlights: [
      { title: "Female", text: "6 Months Old" },
    ],
    care: ["4x 6-in-1 Vaccination", "Complete Deworming", "PCCI Papers On Hand"],
    images: ["images/dogs/cherry-1.jpg", "images/dogs/cherry-2.jpg", "images/dogs/cherry-3.jpg", "images/dogs/cherry-4.jpg", "images/dogs/cherry-5.jpg"],
  },
  {
    id: "ruby",
    name: "Ruby",
    breed: "Deep Red Teacup Poodle",
    tags: [],
    description:
      "Small in size, overflowing with charm! A lovely deep red beauty with imported lineage, perfect for a family looking for an adorable little companion. Looking for her forever loving home.",
    highlights: [
      { title: "Female", text: "Teacup Poodle" },
      { title: "Deep Red", text: "Color" },
      { title: "Imported", text: "Lineage" },
    ],
    care: ["Complete Vaccination", "With PCCI Papers"],
    images: ["images/dogs/ruby-desc.jpg", "images/dogs/ruby-1.jpg", "images/dogs/ruby-2.jpg", "images/dogs/ruby-3.jpg", "images/dogs/ruby-5.jpg"],
  },
  {
    id: "theo",
    name: "Theo",
    breed: "Imperial Size Shih Tzu",
    status: "Ready for release anytime",
    tags: [],
    description:
      "A handsome little gentleman with an adorable face and charming personality! Looking for a loving family to call his own.",
    highlights: [
      { title: "Young Adult", text: "10 Months Old" },
    ],
    care: ["Complete Vaccination", "6-in-1 Vaccine + Anti-Rabies", "PCCI Papers On Hand"],
    images: ["images/dogs/theo-desc.jpg", "images/dogs/theo-2.jpg", "images/dogs/theo-3.jpg", "images/dogs/theo-4.jpg"],
  },
  {
    id: "cherry-2",
    name: "Cherry",
    breed: "Red Apricot Teacup Poodle",
    tags: [],
    description:
      "A little bundle of sweetness with an irresistibly adorable doll face! A lovely female Red Apricot Teacup Poodle with a charming look and precious personality. Ready to find her forever loving family!",
    highlights: [
      { title: "Female", text: "Teacup Size" },
      { title: "Red Apricot", text: "Color" },
      { title: "Sweet", text: "Doll Face" },
    ],
    care: ["Complete Vaccination", "With PCCI Papers"],
    images: ["images/dogs/cherry-1-2.jpg", "images/dogs/cherry-2-2.jpg", "images/dogs/cherry-3-2.jpg", "images/dogs/cherry-4-2.jpg", "images/dogs/cherry-5-2.jpg", "images/dogs/cherry-6-2.jpg"],
  },
  {
    id: "ivory",
    name: "Ivory",
    breed: "Female Bichon Frise",
    tags: ["puppy"],
    description:
      "Pure elegance in a fluffy little package! A beautiful female Bichon Frise with imported lineage, ready to bring endless love and happiness to her future family. Looking for a loving home where she will be cherished as family.",
    highlights: [
      { title: "Puppy", text: "3 Months Old" },
      { title: "Imported", text: "Lineage" },
    ],
    care: ["Complete 6-in-1 Vaccination", "Complete Deworming", "With PCCI Papers"],
    images: ["images/dogs/ivory-desc.jpg", "images/dogs/ivory-2.jpg", "images/dogs/ivory-3.jpg", "images/dogs/ivory-4.jpg"],
  },
  {
    id: "ginger",
    name: "Ginger",
    breed: "Imperial Shih Tzu",
    status: "Ready for release!",
    tags: [],
    description:
      "Sweet little doll face with an irresistibly adorable look! Looking for a loving family who will treat her as part of the family.",
    highlights: [
      { title: "Imperial", text: "Size Shih Tzu" },
      { title: "Beautiful", text: "Doll Face" },
    ],
    care: ["Complete Vaccination", "With PCCI Papers"],
    images: ["images/dogs/ginger-desc.jpg", "images/dogs/ginger-2.jpg", "images/dogs/ginger-3.jpg", "images/dogs/ginger-4.jpg"],
  },

    {
    id: "jewel",
    name: "Jewel",
    breed: "Princess Type Cream Shih Tzu",
    tags: ["puppy"],
    description:
      "Meet Jewel, our adorable little princess with a beautiful cream coat, charming doll face, and irresistibly sweet expression. A lovely companion for a family looking for a precious new addition.",
    highlights: [
      { title: "Puppy", text: "3 Months Old" },
      { title: "Cream", text: "Color" },
      { title: "Sweet", text: "Doll Face" },
    ],
    care: ["Complete 6-in-1 Vaccine", "PCCI Papers on Hand"],
    images: ["images/dogs/jewel-1.jpg", "images/dogs/jewel-2.jpg", "images/dogs/jewel-3.jpg"],
  },

  
  {
    id: "bentley",
    name: "Bentley",
    breed: "Compact Size Shih Tzu",
    tags: ["puppy"],
    description:
      "Our adorable little gentleman in a beautiful cream coat! A charming little prince with a lovely coat and a precious personality!",
    highlights: [
      { title: "Male", text: "4 Months Old" },
      { title: "Compact", text: "Size" },
      { title: "Imported", text: "Lineage" },
    ],
    care: ["Complete 6-in-1 Vaccination", "PCCI Papers"],
    images: ["images/dogs/bentley-1.jpg", "images/dogs/bentley-2.jpg", "images/dogs/bentley-3.jpg", "images/dogs/bentley-4.jpg", "images/dogs/bentley-5.jpg", "images/dogs/bentley-6.jpg"],
  },
  {
    id: "henri",
    name: "Henri",
    breed: "Male Tricolor Teacup Chihuahua",
    tags: [],
    description:
      "Tiny in size, big in charm! Meet Henri, our adorable tricolor Chihuahua with a sweet face and irresistible puppy charm. A little companion ready to steal your heart! Looking for a loving family to call his own.",
    highlights: [
      { title: "Male", text: "Tricolor Chihuahua" },
      { title: "Teacup", text: "Size" },
    ],
    care: ["Complete Vaccination", "PCCI Papers on Hand"],
    images: ["images/dogs/henri-desc.jpg", "images/dogs/henri-2.jpg", "images/dogs/henri-3.jpg"],
  },
  {
    id: "hazel",
    name: "Hazel",
    breed: "Female Fawn Teacup Chihuahua",
    tags: [],
    description:
      "Tiny, elegant, and irresistibly adorable! Meet Hazel, our lovely fawn-colored little princess with a sweet charm and precious personality. Looking for a loving family who will cherish her forever.",
    highlights: [
      { title: "Female", text: "Fawn Chihuahua" },
      { title: "Teacup", text: "Size" },
    ],
    care: ["Complete Vaccination", "PCCI Papers on Hand"],
    images: ["images/dogs/hazel-desc.jpg", "images/dogs/hazel-2.jpg", "images/dogs/hazel-3.jpg"],
  },
  {
    id: "roux",
    name: "Roux",
    breed: "Tiny Imperial Shih Tzu",
    tags: [],
    description:
      "A gorgeous Roux Liver Line with a sweet doll face and adorable tiny features! Looking for a loving family to call her own.",
    highlights: [
      { title: "Tiny", text: "Size" },
      { title: "Beautiful", text: "Doll Face" },
      { title: "From", text: "ICG Lineage" },
    ],
    care: ["Complete Deworming", "Complete 6-in-1 Vaccination", "With PCCI Papers"],
    images: ["images/dogs/roux-desc.jpg", "images/dogs/roux-2.jpg", "images/dogs/roux-3.jpg", "images/dogs/roux-4.jpg"],
  },
  {
    id: "stark",
    name: "Stark",
    breed: "Male Imperial Shih Tzu",
    tags: [],
    description:
      "A handsome little gentleman with a charming teddy bear face! Meet Stark, our adorable black Shih Tzu with beautiful white markings and a lovely personality. Looking for a loving family who will cherish him as their own.",
    highlights: [
      { title: "Black", text: "with White Markings" },
      { title: "Adorable", text: "Teddy Bear Look" },
    ],
    images: ["images/dogs/stark-1.jpg", "images/dogs/stark-2.jpg", "images/dogs/stark-3.jpg", "images/dogs/stark-4.jpg"],
  },

    {
    id: "martin",
    name: "Martin",
    breed: "Deep Red Toy Poodle",
    status: "Ready for release",
    tags: ["puppy"],
    description:
      "Meet Martin, a charming Deep Red Toy Poodle with a beautiful rich coat and an adorable teddy-bear appearance. Coming from imported lineage, he carries the elegance and appeal of a premium Toy Poodle.",
    highlights: [
      { title: "Puppy", text: "3 Months Old" },
      { title: "Deep Red", text: "Color" },
      { title: "Imported", text: "Lineage" },
    ],
    care: ["Complete 4x 6-in-1 Vaccination", "Complete Deworming", "PCCI Papers on Hand"],
    images: ["images/dogs/martin-1.jpg", "images/dogs/martin-2.jpg", "images/dogs/martin-3.jpg", "images/dogs/martin-4.jpg"],
  },
  {
    id: "scarlet",
    name: "Scarlet",
    breed: "Princess-Type Shih Tzu",
    tags: [],
    description:
      "Meet Scarlet, our lovely Princess-Type Shih Tzu with a beautiful chocolate-brown coat and an irresistibly sweet face. A charming little princess who brings warmth and happiness to any loving home.",
    highlights: [
      { title: "Female", text: "Shih Tzu" },
      { title: "Chocolate Brown", text: "Coat" },
      { title: "Princess", text: "Type" },
    ],
    care: ["Complete 6-in-1 Vaccine", "PCCI Papers on Hand"],
    images: ["images/dogs/scarlet-1.jpg", "images/dogs/scarlet-2.jpg", "images/dogs/scarlet-3.jpg", "images/dogs/scarlet-4.jpg"],
  },
];