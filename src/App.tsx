import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import Home from "./pages/Home";

function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Home />
    </MantineProvider>
  );
}

export default App;
