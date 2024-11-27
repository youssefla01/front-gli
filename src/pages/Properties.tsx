import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Button, Input, Select, Row, Col, Modal, 
  Empty, Spin, App 
} from 'antd';
import { Plus, Search } from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/properties/PropertyCard';
import PropertyForm from '../components/properties/PropertyForm';
import { Property, PropertyFormData } from '../types/property';
import { transformResponse } from '../utils/queryUtils';

const { Search: AntSearch } = Input;

const Properties = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { message } = App.useApp();

  const { data: properties = [], isLoading, refetch } = useQuery(
    ['properties', searchTerm, typeFilter],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter) params.append('type', typeFilter);
      
      const response = await axios.get(`/api/properties?${params}`);
      return transformResponse(response.data?.properties || []);
    }
  );

  const handleCreateOrUpdate = async (values: PropertyFormData) => {
    try {
      if (selectedProperty) {
        await axios.patch(`/api/properties/${selectedProperty.id}`, values);
        message.success('Bien modifié avec succès');
      } else {
        await axios.post('/api/properties', values);
        message.success('Bien créé avec succès');
      }
      setIsModalVisible(false);
      setSelectedProperty(null);
      refetch();
    } catch (error) {
      message.error('Une erreur est survenue');
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsModalVisible(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <AntSearch
            placeholder="Rechercher un bien..."
            allowClear
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            prefix={<Search className="w-4 h-4 text-gray-400" />}
          />
          <Select
            placeholder="Type de bien"
            allowClear
            onChange={setTypeFilter}
            className="w-full sm:w-48"
          >
            <Select.Option value="apartment">Appartement</Select.Option>
            <Select.Option value="house">Maison</Select.Option>
            <Select.Option value="commercial">Local commercial</Select.Option>
            <Select.Option value="land">Terrain</Select.Option>
          </Select>
        </div>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedProperty(null);
            setIsModalVisible(true);
          }}
          className="w-full sm:w-auto"
        >
          Nouveau bien
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : properties && properties.length > 0 ? (
        <Row gutter={[16, 16]}>
          {properties.map((property: Property) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={property.id}>
              <PropertyCard
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          description="Aucun bien trouvé"
          className="bg-white p-8 rounded-lg"
        />
      )}

      <Modal
        title={selectedProperty ? 'Modifier le bien' : 'Nouveau bien'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedProperty(null);
        }}
        footer={null}
        width={800}
      >
        <PropertyForm
          initialValues={selectedProperty || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedProperty(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Properties;