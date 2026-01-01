import type { Project, About } from '@/types';

// Sample projects data - will be replaced by Supabase data
export const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Urban Land Use Mapping',
    description: 'Comprehensive urban land use classification project using satellite imagery and machine learning algorithms. This project involved analyzing over 10,000 hectares of urban area to identify land use patterns, zoning violations, and urban sprawl trends.',
    location: {
      name: 'Jakarta, Indonesia',
      latitude: -6.2088,
      longitude: 106.8456
    },
    year: 2023,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800', caption: 'Urban mapping visualization' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', caption: 'Jakarta cityscape' },
    ],
    tech_stack: ['QGIS', 'Python', 'TensorFlow', 'PostGIS', 'Leaflet'],
    impacts: [
      'Mapped 10,000+ hectares of urban area',
      'Identified 150+ zoning violations',
      'Reduced manual survey time by 60%',
      'Provided data for city planning decisions'
    ],
    external_link: 'https://example.com/project-1',
    is_visible: true,
    created_at: '2023-06-15T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Forest Monitoring System',
    description: 'Real-time forest monitoring system using satellite data and change detection algorithms to track deforestation and illegal logging activities in protected areas.',
    location: {
      name: 'Sumatra, Indonesia',
      latitude: 0.5897,
      longitude: 101.3431
    },
    year: 2023,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800', caption: 'Forest aerial view' },
    ],
    tech_stack: ['Google Earth Engine', 'Python', 'React', 'Node.js', 'PostgreSQL'],
    impacts: [
      'Monitored 50,000 hectares of protected forest',
      'Detected 200+ illegal logging incidents',
      'Reduced response time from weeks to hours',
      'Supported 3 government agencies'
    ],
    external_link: 'https://example.com/project-2',
    is_visible: true,
    created_at: '2023-03-20T00:00:00Z',
    updated_at: '2023-11-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Smart City Infrastructure',
    description: 'Developed a comprehensive GIS-based smart city infrastructure management system including utilities, transportation, and public facilities mapping.',
    location: {
      name: 'Singapore',
      latitude: 1.3521,
      longitude: 103.8198
    },
    year: 2024,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', caption: 'Singapore smart city' },
    ],
    tech_stack: ['ArcGIS', 'Python', 'Django', 'React', 'Mapbox GL'],
    impacts: [
      'Integrated 15+ data sources',
      'Served 100,000+ daily users',
      'Improved infrastructure planning efficiency by 40%',
      'Won GovTech Innovation Award'
    ],
    external_link: 'https://example.com/project-3',
    is_visible: true,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-06-20T00:00:00Z'
  },
  {
    id: '4',
    title: 'Flood Risk Assessment',
    description: 'Developed a flood risk assessment and early warning system using hydrological modeling and real-time weather data integration.',
    location: {
      name: 'Bangkok, Thailand',
      latitude: 13.7563,
      longitude: 100.5018
    },
    year: 2022,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Bangkok river system' },
    ],
    tech_stack: ['HEC-RAS', 'Python', 'QGIS', 'PostgreSQL', 'React'],
    impacts: [
      'Covered 2,500 sq km flood-prone area',
      'Predicted flood events 72 hours in advance',
      'Protected 500,000+ residents',
      'Reduced flood damage costs by 30%'
    ],
    external_link: 'https://example.com/project-4',
    is_visible: true,
    created_at: '2022-08-05T00:00:00Z',
    updated_at: '2023-02-10T00:00:00Z'
  },
  {
    id: '5',
    title: 'Agricultural Land Analysis',
    description: 'Precision agriculture project using drone imagery and spectral analysis to optimize crop management and yield prediction.',
    location: {
      name: 'Central Java, Indonesia',
      latitude: -7.1500,
      longitude: 110.1403
    },
    year: 2023,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', caption: 'Agricultural field mapping' },
    ],
    tech_stack: ['Pix4D', 'Python', 'ArcGIS Pro', 'TensorFlow', 'React Native'],
    impacts: [
      'Analyzed 5,000 hectares of farmland',
      'Increased crop yield by 25%',
      'Reduced water usage by 35%',
      'Supported 1,000+ farmers'
    ],
    external_link: 'https://example.com/project-5',
    is_visible: true,
    created_at: '2023-05-15T00:00:00Z',
    updated_at: '2023-10-20T00:00:00Z'
  },
  {
    id: '6',
    title: 'Coastal Erosion Monitoring',
    description: 'Long-term coastal erosion monitoring project using multi-temporal satellite imagery and ground survey data to track shoreline changes.',
    location: {
      name: 'Bali, Indonesia',
      latitude: -8.4095,
      longitude: 115.1889
    },
    year: 2022,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', caption: 'Bali coastline' },
    ],
    tech_stack: ['ENVI', 'Python', 'DSAS', 'PostGIS', 'OpenLayers'],
    impacts: [
      'Monitored 200 km of coastline',
      'Identified 15 critical erosion hotspots',
      'Informed coastal protection policies',
      'Saved $2M in potential damage'
    ],
    external_link: 'https://example.com/project-6',
    is_visible: true,
    created_at: '2022-03-01T00:00:00Z',
    updated_at: '2022-12-15T00:00:00Z'
  },
  {
    id: '7',
    title: 'Transportation Network Analysis',
    description: 'Comprehensive transportation network analysis for optimizing public transit routes and reducing traffic congestion in metropolitan areas.',
    location: {
      name: 'Surabaya, Indonesia',
      latitude: -7.2575,
      longitude: 112.7521
    },
    year: 2024,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', caption: 'Urban transportation' },
    ],
    tech_stack: ['ArcGIS Network Analyst', 'Python', 'SUMO', 'React', 'Node.js'],
    impacts: [
      'Analyzed 500+ km of road network',
      'Optimized 50 bus routes',
      'Reduced average commute time by 20%',
      'Decreased carbon emissions by 15%'
    ],
    external_link: 'https://example.com/project-7',
    is_visible: true,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-07-10T00:00:00Z'
  },
  {
    id: '8',
    title: 'Mining Site Reclamation',
    description: 'Environmental monitoring and reclamation planning for post-mining sites using remote sensing and GIS analysis.',
    location: {
      name: 'Kalimantan, Indonesia',
      latitude: -1.6815,
      longitude: 116.4194
    },
    year: 2023,
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', caption: 'Mining reclamation' },
    ],
    tech_stack: ['ERDAS Imagine', 'Python', 'QGIS', 'PostgreSQL', 'Django'],
    impacts: [
      'Assessed 3,000 hectares of mining sites',
      'Created reclamation plans for 10 sites',
      'Restored 500 hectares of forest',
      'Complied with environmental regulations'
    ],
    external_link: 'https://example.com/project-8',
    is_visible: true,
    created_at: '2023-07-01T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
];

// Sample about data
export const sampleAbout: About = {
  id: '1',
  name: 'Dhanypedia',
  title: 'GIS Specialist & Geospatial Developer',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  summary: `I am a passionate GIS specialist with over 5 years of experience in geospatial analysis, remote sensing, and spatial data solutions. My expertise spans across various domains including urban planning, environmental monitoring, agriculture, and infrastructure management.

I combine traditional GIS methodologies with modern technologies like machine learning, cloud computing, and web development to create innovative geospatial solutions that drive decision-making and create real-world impact.`,
  skills: [
    {
      category: 'GIS Software',
      items: ['QGIS', 'ArcGIS Pro', 'ERDAS Imagine', 'ENVI', 'Google Earth Engine']
    },
    {
      category: 'Programming',
      items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'R']
    },
    {
      category: 'Web Development',
      items: ['React', 'Next.js', 'Node.js', 'Django', 'FastAPI']
    },
    {
      category: 'Geospatial Tools',
      items: ['PostGIS', 'Leaflet', 'Mapbox GL', 'OpenLayers', 'Cesium']
    }
  ],
  experience: [
    {
      company: 'GeoTech Solutions',
      role: 'Senior GIS Developer',
      period: '2022 - Present',
      description: 'Leading geospatial development projects for government and enterprise clients across Southeast Asia.'
    },
    {
      company: 'MapInnovate',
      role: 'GIS Analyst',
      period: '2020 - 2022',
      description: 'Conducted spatial analysis and developed web mapping applications for urban planning projects.'
    },
    {
      company: 'EnviroMap Consulting',
      role: 'Junior GIS Specialist',
      period: '2018 - 2020',
      description: 'Performed environmental impact assessments and created thematic maps for conservation projects.'
    }
  ],
  education: [
    {
      institution: 'University of Indonesia',
      degree: 'M.Sc. in Geoinformatics',
      year: '2018'
    },
    {
      institution: 'Bandung Institute of Technology',
      degree: 'B.Sc. in Geodetic Engineering',
      year: '2016'
    }
  ],
  social_links: [
    { platform: 'GitHub', url: 'https://github.com/dhanyyudi', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/dhanyyudi', icon: 'linkedin' }
  ],
  updated_at: '2024-06-20T00:00:00Z'
};
