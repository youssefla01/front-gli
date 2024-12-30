import React, { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import { UserFormData } from "../../types/user";

interface UserFormProps {
  initialValues?: UserFormData;
  onSubmit: (values: UserFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={(values) => {
        onSubmit(values);
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="nom"
          label="Nom"
          rules={[
            { required: true, message: "Le nom est requis" },
            {
              pattern: /^[a-zA-Z]+$/,
              message: "Le nom ne peut contenir que des lettres",
            },
            { min: 2, message: "Le nom doit avoir au moins 2 caractères" },
          ]}
        >
          <Input placeholder="Entrez votre nom" />
        </Form.Item>

        <Form.Item
          name="prenom"
          label="Prénom"
          rules={[
            { required: true, message: "Le prénom est requis" },
            {
              pattern: /^[a-zA-Z]+$/,
              message: "Le prénom ne peut contenir que des lettres",
            },
            { min: 2, message: "Le prénom doit avoir au moins 2 caractères" },
          ]}
        >
          <Input placeholder="Entrez votre prénom" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "L'email est requis" },
          { type: "email", message: "Veuillez saisir un email valide" },
        ]}
      >
        <Input placeholder="Entrez votre email (exemple@domaine.com)" />
      </Form.Item>

      {!initialValues && (
        <Form.Item
          name="mot_de_passe"
          label="Mot de passe"
          rules={[
            { required: true, message: "Le mot de passe est requis" },
            // { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' },
            {
              pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              message:
                "Le mot de passe doit inclure au moins une majuscule, un chiffre et un caractère spécial",
            },
          ]}
        >
          <Input.Password placeholder="Entrez un mot de passe sécurisé" />
        </Form.Item>
      )}

      <Form.Item
        name="role"
        label="Rôle"
        rules={[
          { required: true, message: "Le rôle est requis" },
          {
            validator: (_, value) =>
              value &&
              ["admin", "manager", "accountant", "agent"].includes(value)
                ? Promise.resolve()
                : Promise.reject(new Error("Rôle invalide")),
          },
        ]}
      >
        <Select placeholder="Sélectionnez un rôle">
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="manager">Gestionnaire</Select.Option>
          <Select.Option value="accountant">Comptable</Select.Option>
          <Select.Option value="agent">Agent</Select.Option>
        </Select>
      </Form.Item>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>Annuler</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          {initialValues ? "Modifier" : "Créer"}
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
