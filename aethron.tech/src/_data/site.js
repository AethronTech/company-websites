module.exports = {
  url: process.env.NODE_ENV === 'production' 
    ? 'https://aethron.tech'
    : 'http://localhost:8082',
  title: 'Aethron Technologies',
  description: 'Digital solutions for IT professionals',
  author: 'Aethron Technologies',
  buildTime: new Date()
};
