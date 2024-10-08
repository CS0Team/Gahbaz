import { Accordion, Text, Container, Title, Badge } from '@mantine/core';
import { FiCoffee, FiCloudSnow, FiAnchor } from "react-icons/fi";

const SectionFive = () => {
    //const theme = useMantineTheme();

    return (
        <section id="section-five">
            <Container>
                <div style={{ marginBottom: 30 }}>
                    <div style={{ textAlign: 'left' }}><Badge variant="filled" color="brand">FAQs</Badge></div>
                    <Text color="black">
                        <Title order={1} style={{ marginTop: 10 }}>الأسئلة الشائعة!</Title>
                    </Text>
                </div>

                <Accordion variant="contained">
                    <Accordion.Item value="item1">
                        <Accordion.Control icon={<FiCoffee size={20} className={"text-primary"} />}>
                            هل يمكن ربط النظام مع إخر?
                        </Accordion.Control>
                        <Accordion.Panel>Yes, of course.</Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="item2">
                        <Accordion.Control icon={<FiCloudSnow className={"text-primary"} />}>
                            هل توجد طريقة لاستخراج الجداول؟
                        </Accordion.Control>
                        <Accordion.Panel>Unfortunately no.</Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="item3">
                        <Accordion.Control icon={<FiAnchor className={"text-primary"} />}>
                            هل يمكن اختراق حسابي
                        </Accordion.Control>
                        <Accordion.Panel>Oh yes!</Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </section>
    );

};

export default SectionFive;