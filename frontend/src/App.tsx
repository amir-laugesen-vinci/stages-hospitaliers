import { Layout, Typography, Button, Space, Table, Tag, Select, Modal, Form, Input, message, Descriptions } from 'antd';
import { useEffect, useState } from 'react';
import { api } from './api';
import type { RequestItem, Statut } from './types';

const { Header, Content } = Layout;
const services = ['Cardiologie','Urgences','Pédiatrie'];

export default function App() {
  const [data, setData] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statut, setStatut] = useState<string | undefined>();
  const [service, setService] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<RequestItem | undefined>();
  const [form] = Form.useForm();

  const reload = async () => {
    setLoading(true);
    try {
      const res = await api.get<RequestItem[]>('/requests', { statut, service });
      setData(res);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { reload(); }, [statut, service]);

  const create = async () => {
    const v = await form.validateFields();
    // v.dateDebut / v.dateFin sont des string "YYYY-MM-DD"
    const startISO = new Date(v.dateDebut).toISOString().slice(0,10);
    const endISO   = new Date(v.dateFin).toISOString().slice(0,10);
    await api.post<RequestItem>('/requests', {
      nom: v.nom, prenom: v.prenom, email: v.email, service: v.service,
      dateDebut: startISO, dateFin: endISO, motivation: v.motivation || undefined
    });
    message.success('Demande créée');
    setOpen(false);
    form.resetFields();
    reload();
  };

  const changeStatus = async (s: Statut) => {
    if (!detail) return;
    await api.patch(`/requests/${detail.id}/status`, { statut: s });
    message.success('Statut mis à jour');
    setDetail(undefined);
    reload();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', color:'#fff' }}>
        <Typography.Title level={3} style={{ color:'#fff', margin:0 }}>Stages Hospitaliers</Typography.Title>
        <Button type="primary" onClick={() => setOpen(true)}>Nouvelle demande</Button>
      </Header>
      <Content style={{ padding: 24 }}>
        <Space style={{ marginBottom: 12 }}>
          <Select allowClear placeholder="Filtrer statut" style={{ width: 160 }} onChange={setStatut as any}
                  options={[{value:'EN_ATTENTE'},{value:'APPROUVEE'},{value:'REFUSEE'}]} />
          <Select allowClear placeholder="Filtrer service" style={{ width: 220 }} onChange={setService as any}
                  options={services.map(s=>({value:s}))} />
        </Space>

        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          onRow={record => ({ onClick: () => setDetail(record) })}
          columns={[
            { title: 'Nom', dataIndex: 'nom' },
            { title: 'Prénom', dataIndex: 'prenom' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Service', dataIndex: 'service' },
            { title: 'Début', dataIndex: 'dateDebut', render: v => new Date(v).toLocaleDateString() },
            { title: 'Fin', dataIndex: 'dateFin', render: v => new Date(v).toLocaleDateString() },
            { title: 'Statut', dataIndex: 'statut', render: (s: Statut) => <Tag color={s==='APPROUVEE'?'green':s==='REFUSEE'?'red':'gold'}>{s}</Tag> },
          ]}
        />

        {/* Modal création */}
        <Modal title="Nouvelle demande" open={open} onCancel={()=> setOpen(false)} onOk={create} okText="Créer">
          <Form form={form} layout="vertical">
            <Form.Item name="nom" label="Nom" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="prenom" label="Prénom" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="email" label="Email" rules={[{ type:'email', required: true }]}><Input /></Form.Item>
            <Form.Item name="service" label="Service" rules={[{ required: true }]}>
              <Select options={services.map(s=>({value:s}))} />
            </Form.Item>

            {/* Dates natives, zéro dépendance */}
            <Form.Item name="dateDebut" label="Date de début" rules={[{ required: true }]}><Input type="date" /></Form.Item>
            <Form.Item
              name="dateFin"
              label="Date de fin"
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = new Date(getFieldValue('dateDebut'));
                    const end = new Date(value);
                    if (!value || isNaN(start.getTime()) || isNaN(end.getTime())) return Promise.resolve();
                    return end > start ? Promise.resolve() : Promise.reject(new Error('La fin doit être après le début'));
                  }
                })
              ]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item name="motivation" label="Motivation"><Input.TextArea rows={3} /></Form.Item>
          </Form>
        </Modal>

        {/* Modal détail/changement de statut */}
        <Modal title={detail ? `Demande #${detail.id}` : ''} open={!!detail} onCancel={()=> setDetail(undefined)} onOk={()=> setDetail(undefined)} okText="Fermer">
          {detail && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Nom">{detail.nom} {detail.prenom}</Descriptions.Item>
              <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
              <Descriptions.Item label="Service">{detail.service}</Descriptions.Item>
              <Descriptions.Item label="Période">
                {new Date(detail.dateDebut).toLocaleDateString()} → {new Date(detail.dateFin).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Motivation">{detail.motivation || '—'}</Descriptions.Item>
              <Descriptions.Item label="Statut">
                <Select value={detail.statut} style={{ width: 200 }}
                        onChange={s => changeStatus(s as Statut)}
                        options={[{value:'EN_ATTENTE'},{value:'APPROUVEE'},{value:'REFUSEE'}]} />
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </Content>
    </Layout>
  );
}
