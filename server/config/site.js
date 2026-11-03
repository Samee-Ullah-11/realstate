// Single source of truth for client business facts.
// Never hardcode these anywhere else. [FILL IN] values stay visible
// placeholders in development; `npm run check:placeholders` catches them.

const site = {
  agentName: 'Yaseen Khan',
  businessName: 'Milestone Realstate',
  city: 'Peshawar',
  areasServed: ['Peshawar'],

  phone: '03159924831',
  // International format for wa.me links
  whatsapp: '923159924831',
  email: 'sameeullah634@gmail.com',

  officeAddress: '[FILL IN: office address]',
  googleMapsLink: '[FILL IN: Google Maps share link]',
  googleMapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2407.240214499675!2d71.4909800741177!3d34.01143801988644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d9177e983109c9%3A0x3b10df033d73a833!2sSESAME%20SOLUTION!5e1!3m2!1sen!2s!4v1793700749899!5m2!1sen!2s',

  officeHours: {
    en: '9 AM to 5 PM, Monday to Saturday',
    ur: '[UR REVIEW: صبح 9 بجے سے شام 5 بجے، پیر تا ہفتہ]',
  },

  socialLinks: {
    // '[FILL IN or remove]': facebook, instagram, youtube — omit keys that don't exist
  },

  propertyTypes: ['house', 'plot', 'apartment', 'commercial'], // '[FILL IN: confirm list]'

  // Real numbers only. null = do not show that stat anywhere.
  stats: {
    yearsOfExperience: null, // '[FILL IN or keep null]'
    dealsClosed: null, // '[FILL IN or keep null]'
  },

  googleBusinessProfileUrl: '[FILL IN or "none yet"]',
  // Place ID itself lives in .env (GOOGLE_PLACE_ID) because it pairs with the API key.

  // Home hero. Temporary stock photo: '[FILL IN: real hero photo of a listed property]'
  heroPhoto: {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=60',
    srcset:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=480&q=60 480w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=768&q=60 768w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=60 1080w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=60 1280w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=60 1800w',
  },

  // 1 marla in sq ft. 272.25 is the common standard; some Peshawar localities use 225.
  marlaSqFt: 272.25,
  kanalMarlas: 20,

  currency: 'PKR',
};

module.exports = site;
