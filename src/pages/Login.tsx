
import { Form, Input, Button, Card, App } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

const Login = () => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  const onFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error: any) {
      message.error(error.message || "Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };
  if (isLoading) {
    return <LoadingScreen tip="Connexion en cours..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 text-blue-900 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">BabSouss.immo</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Veuillez saisir votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input size="large" placeholder="votre@email.com" />
          </Form.Item>

          <Form.Item
            label="Mot de passe"
            name="password"
            rules={[{ required: true, message: 'Veuillez saisir votre mot de passe' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Se connecter
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;