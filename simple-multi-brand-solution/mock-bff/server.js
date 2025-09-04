const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const brands = {
  acme: {
    id: 'acme',
    name: 'ACME Corp',
    primaryColor: '#ff6b35',
    secondaryColor: '#004e89',
    logo: 'https://img.icons8.com/?size=150&id=85399&format=png&color=ff6b35'
  },
  globex: {
    id: 'globex',
    name: 'Globex Industries',
    primaryColor: '#6a4c93',
    secondaryColor: '#f72585',
    logo: 'https://img.icons8.com/?size=100&id=3685&format=png&color=ffffff'
  }
};

const content = {
  acme: {
    title: 'Welcome to ACME Corp',
    subtitle: 'Your trusted partner in innovative solutions',
    heroImage: 'https://placehold.co/400x200/ff6b35/ffffff?text=ACME+Hero',
    ctaText: 'Get Started with ACME'
  },
  globex: {
    title: 'Globex Industries',
    subtitle: 'Leading the future of technology',
    heroImage: 'https://placehold.co/400x200/6a4c93/ffffff?text=GLOBEX+Hero',
    ctaText: 'Explore Globex Solutions'
  }
};

app.get('/api/brands/:id', (req, res) => {
  const brand = brands[req.params.id];
  if (brand) {
    res.json(brand);
  } else {
    res.status(404).json({ error: 'Brand not found' });
  }
});

app.get('/api/content/:brandId', (req, res) => {
  const brandContent = content[req.params.brandId];
  if (brandContent) {
    res.json(brandContent);
  } else {
    res.status(404).json({ error: 'Content not found' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock BFF server running on http://localhost:${PORT}`);
});