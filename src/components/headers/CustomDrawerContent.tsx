import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';

const CustomDrawerContent = (props: any) => {
  const { navigation } = props;

  return (
    <DrawerContentScrollView {...props}>
      <Drawer.Section>
        <Drawer.Item
          label="หน้าหลัก"
          icon="home"
          onPress={() => {
            navigation.navigate('Main', { screen: 'หน้าหลัก' });
          }}
        />
        <Drawer.Item
          label="ตั๋ว"
          icon="ticket-outline"
          onPress={() => {
            navigation.navigate('Main', { screen: 'ตั๋ว' });
          }}
        />
        <Drawer.Item
          label="บริจาค"
          icon="donate"
          onPress={() => {
            navigation.navigate('Main', { screen: 'บริจาค' });
          }}
        />
        <Drawer.Item
          label="ตั้งค่า"
          icon="settings-outline"
          onPress={() => {
            navigation.navigate('Main', { screen: 'บัญชี' });
          }}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
