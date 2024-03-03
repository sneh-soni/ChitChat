import React from "react";
import { Helmet } from "react-helmet-async";
const Title = ({
  title = "ChitChat",
  description = "Seamless ChitChatting with friends",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
