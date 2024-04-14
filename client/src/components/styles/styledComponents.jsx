import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
  whiteSpace: "nowrap",
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 0.1rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 90%;
  border: none;
  outline: none;
  padding: 0 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background-color: rgba(0, 0, 0, 0.25);
  ::placeholder {
    color: rgba(0, 0, 0, 0.5);
    font-size: 0.9rem;
  }
`;

const SearchField = styled("input")`
  padding: 0.5rem 1.2rem;
  width: 18vmax;
  border: none;
  outline: none;
  border-radius: 0.5rem;
  background-color: rgba(0, 0, 0, 0.25);
`;

const CurvedButton = styled("button")`
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  &:hover {
    background-color: black;
  }
`;

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.25); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 0.8s infinite`,
}));

export {
  VisuallyHiddenInput,
  Link,
  InputBox,
  SearchField,
  CurvedButton,
  BouncingSkeleton,
};
