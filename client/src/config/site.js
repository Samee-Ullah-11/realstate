// Mirror of server/config/site.js — public fields only.
// Keep the two files in sync; never hardcode these values in components.

const site = {
  agentName: 'Yaseen Khan',
  businessName: 'Milestone Realstate',
  city: 'Peshawar',
  areasServed: ['Peshawar'],

  phone: '03159924831',
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

  socialLinks: {},

  propertyTypes: ['house', 'plot', 'apartment', 'commercial'],

  stats: {
    yearsOfExperience: null,
    dealsClosed: null,
  },

  // Temporary stock photo: '[FILL IN: real hero photo of a listed property]'
  heroPhoto: {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=60',
    srcset:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=480&q=60 480w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=768&q=60 768w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=60 1080w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1280&q=60 1280w, ' +
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=60 1800w',
  },

  marlaSqFt: 272.25,
  kanalMarlas: 20,

  currency: 'PKR',
};

export default site;
