import { useState } from "react";
import { Table, Button, Input, Modal, message, Tag, Space, Switch } from "antd";
import { Plus, Search, Edit2, Trash2, Shield } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import UserForm from "../components/users/UserForm";
import { User } from "../types/user";
import api from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const { Search: AntSearch } = Input;

const Administrateurs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const currentUser = { id: user?.id };

  const { data: administrateurs, isLoading } = useQuery(
    ["administrateurs", searchTerm],
    async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      const response = await api.get(`/administrateurs`,{ params });
      return response.data || [];
    }
  );

  // Mutation pour créer un administrateur
  const createUser = useMutation(
    (userData: any) => api.post("/administrateurs", userData),
    {
      onSuccess: () => {
        message.success("Administrateur créé avec succès");
        setIsModalVisible(false);
        queryClient.invalidateQueries("administrateurs");
      },
      onError: () => {
        message.error("Erreur lors de la création de l'administrateur");
      },
    }
  );

  // Mutation pour mettre à jour un administrateur
  const updateUser = useMutation(
    ({ id, data }: { id: string; data: any }) =>
      api.patch(`/administrateurs/${id}`, data),
    {
      onSuccess: () => {
        message.success("Administrateur modifié avec succès");
        setIsModalVisible(false);
        queryClient.invalidateQueries("administrateurs");
      },
      onError: (error: any) => {
        if (axios.isAxiosError(error) && error.response) {
          const backendMessage =
            error.response.data.message || "Une erreur est survenue";
          message.error(`Erreur : ${backendMessage}`);
        } else {
          message.error("Erreur réseau ou inattendue");
        }
      },
    }
  );
  

  // Mutation pour supprimer un administrateur
  const deleteUser = useMutation(
    (id: string) => api.delete(`/administrateurs/${id}`),
    {
      onSuccess: () => {
        message.success("Administrateur supprimé avec succès");
        queryClient.invalidateQueries("administrateurs");
      },
      onError: () => {
        message.error("Erreur lors de la suppression de l'administrateur");
      },
    }
  );

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet administrateur ?",
      content: "Cette action est irréversible.",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: () => deleteUser.mutate(id),
      icon: <Trash2 className="w-6 h-6 text-red-600" />,
      centered: true, // Centrer le modal
      width: 400, // Largeur du modal
      style: { borderRadius: '10px' }, // Coin arrondi pour un look plus moderne
    });
  };

  // Mutation pour changer le statut d'un administrateur
  const toggleUserStatus = useMutation(
    async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      if (id === currentUser.id) {
        throw new Error("Vous ne pouvez pas désactiver votre propre compte.");
      }
      return api.patch(`/administrateurs/${id}/status`, { status });
    },
    {
      onSuccess: () => {
        message.success("Statut modifié avec succès");
        queryClient.invalidateQueries("administrateurs");
      },
      onError: (error: Error) => {
        message.error(
          error.message || "Erreur lors de la modification du statut"
        );
      },
    }
  );

  // Fonction pour définir la couleur du rôle
  const getRoleColor = (role: string) => {
    console.log(role)
    const colors: Record<string, string> = {
      Manager: "red",
      Admin: "blue",
      accountant: "green",
      agent: "orange",
    };
    return colors[role] || "default";
  };

  const filteredAdministrateurs = administrateurs && administrateurs.length > 0
  ? administrateurs.filter((administrateur: User) =>
      `${administrateur.nom} ${administrateur.prenom} ${administrateur.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  : [];
  // Colonnes de la table des administrateurs
  const columns = [
    {
      title: "Utilisateurs",
      key: "administrateur",
      render: (administrateur: User) => (
        <div>
          <div className="font-medium">
            {administrateur.nom} {administrateur.prenom}
          </div>
          <div className="text-sm text-gray-500">{administrateur.email}</div>
        </div>
      ),
    },
    {
      title: "Rôle",
      key: "role",
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Manager', value: 'Manager' },
        { text: 'Agent', value: 'Agent' },
        { text: 'Comptable', value: 'accountant' },
      ],
      onFilter: (value: string, record: User) => record.role.includes(value),
      render: (administrateur: User) => (
        <Tag
          color={getRoleColor(administrateur.role)}
          icon={<Shield className="w-3 h-3" />}
        >
          {administrateur.role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Statut",
      key: "status",
      filters: [
        { text: 'Actif', value: 'active' },
        { text: 'Inactif', value: 'inactive' },
      ],
      onFilter: (value: string, record: User) => record.status.includes(value),
      render: (administrateur: any) => (
        <Switch
          checked={administrateur.status === "active"}
          onChange={(checked) =>
            toggleUserStatus.mutate({
              id: administrateur.id,
              status: checked ? "active" : "inactive",
            })
          }
          checkedChildren="Actif"
          unCheckedChildren="Inactif"
        />
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (administrateur: User) => {
        if (administrateur.id === currentUser.id) {
          return null;
        }

        return (
          <Space>
            <Button
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                setSelectedUser(administrateur);
                setIsModalVisible(true);
              }}
            />
           <Button
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => showDeleteConfirm(administrateur.id)}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <AntSearch
          placeholder="Rechercher un administrateur..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
          prefix={<Search className="w-4 h-4 text-gray-400" />}
        />
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setSelectedUser(null);
            setIsModalVisible(true);
          }}
        >
          Nouvel administrateur
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredAdministrateurs}
        loading={isLoading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />

      <Modal
        title={
          selectedUser ? "Modifier l'administrateur" : "Nouvel administrateur"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        <UserForm
          initialValues={selectedUser || undefined}
          onSubmit={(values) => {
            if (selectedUser) {
              updateUser.mutate({ id: selectedUser.id, data: values });
            } else {
              createUser.mutate(values);
            }
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedUser(null);
          }}
          loading={createUser.isLoading || updateUser.isLoading}
        />
      </Modal>
    </div>
  );
};

export default Administrateurs;
