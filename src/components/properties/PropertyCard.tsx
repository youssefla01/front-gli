import React from 'react';
import { Card, Tag, Tooltip } from 'antd';
import { Building2, Ruler, DoorOpen, Euro } from 'lucide-react';
import { Property } from '../../types/property';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const getConditionColor = (condition: Property['condition']) => {
    const colors = {
      new: 'green',
      good: 'blue',
      renovate: 'orange',
      poor: 'red',
    };
    return colors[condition];
  };

  const getTypeLabel = (type: Property['type']) => {
    const labels = {
      apartment: 'Appartement',
      house: 'Maison',
      commercial: 'Local commercial',
      land: 'Terrain',
    };
    return labels[type];
  };

  // Get default image based on property type
  const getDefaultImage = (type: Property['type']) => {
    const images = {
      apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      house: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      commercial: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      land: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    };
    return images[type];
  };

  return (
    <Card
      hoverable
      onClick={onClick}
      className="h-full"
      cover={
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.image || getDefaultImage(property.type)}
            alt={property.address}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex gap-2">
              <Tag icon={<Building2 className="w-3 h-3" />} className="bg-white/90">
                {getTypeLabel(property.type)}
              </Tag>
              <Tag color={getConditionColor(property.condition)} className="bg-white/90">
                {property.condition === 'new' ? 'Neuf' : 
                 property.condition === 'good' ? 'Bon état' :
                 property.condition === 'renovate' ? 'À rénover' : 'Mauvais état'}
              </Tag>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600 line-clamp-2 min-h-[3rem]">{property.address}</p>

        <div className="grid grid-cols-2 gap-2">
          <Tooltip title="Surface">
            <div className="flex items-center gap-1 text-gray-600">
              <Ruler className="w-4 h-4" />
              <span>{property.surface} m²</span>
            </div>
          </Tooltip>

          <Tooltip title="Pièces">
            <div className="flex items-center gap-1 text-gray-600">
              <DoorOpen className="w-4 h-4" />
              <span>{property.rooms} pièce{property.rooms > 1 ? 's' : ''}</span>
            </div>
          </Tooltip>
        </div>

        <div className="flex items-center gap-1 text-lg font-semibold text-blue-900">
          <Euro className="w-5 h-5" />
          <span>
            {new Intl.NumberFormat('fr-FR').format(property.estimatedPrice)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;