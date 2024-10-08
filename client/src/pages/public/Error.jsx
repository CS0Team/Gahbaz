import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import image from '../../assets/images/not-found.svg';


export default function Error() {
  return (
    <Container >
      <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
        <Image src={image.src}  />
        <div>
          <Title >Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Button variant="outline" size="md" mt="xl" >
            Get back to home page
          </Button>
        </div>
        <Image src={image.src}  />
      </SimpleGrid>
    </Container>
  );
}