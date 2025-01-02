import { useState } from "react";
import { useQuery } from "react-query";
import { Table, Button, Input, Modal, message, Tooltip, Space } from "antd";
import { Plus, Search, Mail, Phone, Edit2, Trash2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OwnerForm from "../components/owners/OwnerForm";
import { Owner, OwnerFormData } from "../types/owner";
import api from "../config/api";

const { Search: AntSearch } = Input;

const Owners = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  const {
    data: proprietaires,
    isLoading,
    refetch,
  } = useQuery(["proprietaires", searchTerm], async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    const response = await api.get(`/proprietaires`, { params });
    return response.data || [];
  });
  const handleCreateOrUpdate = async (values: OwnerFormData) => {
    try {
      const cleanedValues = Object.keys(values).reduce((acc: any, key: any) => {
        acc[key] = values[key] === undefined ? null : values[key];
        return acc;
      }, {} as OwnerFormData);

      // Création de l'objet FormData
      const formData = new FormData();

      // Ajouter les champs texte
      const textFields = [
        "prenom",
        "nom",
        "email",
        "telephone",
        "numero_urgence",
        "adresse",
        "identifiant_fiscal",
        "rib",
      ];

      textFields.forEach((field) => {
        formData.append(field, cleanedValues[field] || "");
      });

      // Ajouter les dates de création et de mise à jour
      formData.append("date_creation", new Date().toISOString());
      formData.append("date_mise_a_jour", new Date().toISOString());

      // Vérifier et ajouter les fichiers pièce_jointe
      if (cleanedValues.piece_jointe && cleanedValues.piece_jointe.length > 0) {
        // Si des fichiers sont ajoutés, les traiter
        if (Array.isArray(cleanedValues.piece_jointe)) {
          cleanedValues.piece_jointe.forEach((file: File) => {
            if (file && file instanceof File) {
              formData.append("piece_jointe", file);
            }
          });
        } else if (cleanedValues.piece_jointe instanceof File) {
          // Si une seule pièce jointe est ajoutée, l'ajouter également
          formData.append("piece_jointe", cleanedValues.piece_jointe);
        }
      } else {
        // Si aucune pièce jointe n'est ajoutée, on ne fait rien et on ne renvoie pas d'erreur
        // (On ne fait que continuer avec l'envoi des autres données)
        console.log("Aucune pièce jointe ajoutée.");
      }

      // Continuer avec le reste du traitement (envoi du formulaire ou autre logique)

      // Appel API pour création ou mise à jour
      if (selectedOwner) {
        // Mise à jour
        const response = await api.patch(
          `/proprietaires/${selectedOwner.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        message.success("Propriétaire modifié avec succès");
      } else {
        // Création
        const response = await api.post("/proprietaires", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Propriétaire créé avec succès");
      }

      // Réinitialisation de l'état
      setIsModalVisible(false);
      setSelectedOwner(null);
      refetch();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement :", error);

      // Vérification de l'erreur provenant de l'API
      if (error.response && error.response.data) {
        const apiErrorMessage =
          error.response.data.message ||
          "Une erreur est survenue. Veuillez réessayer.";

        // Affichage du message d'erreur spécifique si retourné par l'API
        message.error(apiErrorMessage);
      } else {
        // Affichage d'un message générique en cas d'autre type d'erreur
        message.error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/proprietaires/${id}`);
      message.success("Propriétaire supprimé avec succès");
      refetch();
    } catch (error) {
      message.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleRowClick = (record: Owner) => {
    navigate(`/app/owners/${record.id}`);
  };

  const filteredProprietaires =
    proprietaires && proprietaires.length > 0
      ? proprietaires.filter((proprietaire: Owner) =>
          `${proprietaire.nom} ${proprietaire.prenom} ${proprietaire.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : [];

  const columns = [
    {
      title: "Nom",
      key: "name",
      dataIndex: "nom",
      filters: [
        { text: "Dupont", value: "Dupont" },
        { text: "Martin", value: "Martin" },
      ],
      onFilter: (value: any, record: Owner) => record.nom.includes(value),
      render: (_: any, record: Owner) => (
        <div className="cursor-pointer hover:text-blue-900">
          <div className="font-medium">
            {record.nom} {record.prenom}
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: Owner) => (
        <Space direction="vertical">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <a
              href={`mailto:${record.email}`}
              className="text-blue-900 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {record.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a
              href={`tel:${record.telephone}`}
              className="text-blue-900 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {record.telephone}
            </a>
          </div>
        </Space>
      ),
    },
    {
      title: "Biens",
      key: "properties",
      dataIndex: "propertiesCount",
      filters: [
        { text: "0 bien", value: 0 },
        { text: "1 bien", value: 1 },
        { text: "2 biens ou plus", value: 2 },
      ],
      onFilter: (value: any, record: any) => {
        if (value === 2) return record.propertiesCount >= 2;
        return record.propertiesCount === value;
      },
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-gray-400" />
          <span>
            {record.propertiesCount || 0} bien
            {(record.propertiesCount || 0) > 1 ? "s" : ""}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Owner) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              icon={<Edit2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOwner(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AntSearch
          placeholder="Rechercher un propriétaire..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedOwner(null);
            setIsModalVisible(true);
          }}
        >
          Nouveau propriétaire
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProprietaires}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: "cursor-pointer hover:bg-gray-50",
        })}
      />

      <Modal
        title={
          selectedOwner ? "Modifier le propriétaire" : "Nouveau propriétaire"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedOwner(null);
        }}
        footer={null}
        width={800}
      >
        <OwnerForm
          initialValues={selectedOwner || undefined}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedOwner(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Owners;
