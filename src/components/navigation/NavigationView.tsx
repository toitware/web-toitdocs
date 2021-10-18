import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Libraries } from "../../model/model";
import { RootState } from "../../redux/doc";
import LibraryNavigation from "./LibraryNavigation";

const Wrapper = styled.div`
  background: ${(props): string => props.theme.palette.background.default};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 3rem;
  a {
    color: ${(props): string => props.theme.palette.text.primary};
    text-decoration: none;
    display: block;
    margin: 0.5rem 0;
  }
`;

const Title = styled.div`
  margin-bottom: 3rem;
`;

export type NavigationParams = {
  libraryName: string;
};

export type NavigationProps = {
  className?: string;
} & RouteComponentProps<NavigationParams>;

const NavigationView: React.FC<NavigationProps> = ({
  location,
  match,
  className,
}: NavigationProps) => {
  analytics.page(location.pathname);

  const libraries = useSelector<RootState, Libraries>(
    (state) => state.doc.libraries || {}
  );

  if (!match.params.libraryName) return <></>;

  const rootLibrary = match.params.libraryName.split("/")[0];
  const library = libraries[rootLibrary];

  return (
    <Wrapper className={className}>
      <Link to="/">
        <img alt="Toit" src={logo} height="32px"></img>
      </Link>
      <Title>
        <Typography variant="h5">Libraries</Typography>
      </Title>
      {library && (
        <LibraryNavigation library={library} navigationParams={match.params} />
      )}
    </Wrapper>
  );
};

export default NavigationView;
