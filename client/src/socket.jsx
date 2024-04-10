import { createContext, useMemo, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const GetSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => io(process.env.REACT_APP_SERVER, { withCredentials: true }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { GetSocket, SocketProvider };
