import styled from "@emotion/styled";
import { Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import { ViewMode, viewMode } from "../../App";
import logo from "../../assets/images/logo.svg";
import { Libraries, Library } from "../../model/model";
import { RootState } from "../../redux/doc";
import LibraryNavigation from "./LibraryNavigation";

const Wrapper = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 3rem;
  a {
    color: ${({ theme }) => theme.palette.text.primary};
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
  const libraries = useSelector<RootState, Libraries>(
    (state) => state.doc.libraries || {}
  );

  let library: Library | undefined;
  if (match.params.libraryName) {
    const rootLibrary = match.params.libraryName.split("/")[0];
    library = libraries[rootLibrary];
  }

  return (
    <Wrapper className={className}>
      <Link to="/">
        <img alt="Toit" src={logo} height="32px"></img>
      </Link>
      <Title>
        <Typography variant="h5">Libraries</Typography>
      </Title>
      {viewMode !== ViewMode.SDK && library && (
        <LibraryNavigation
          library={library}
          openLibrary={match.params.libraryName}
        />
      )}
      {viewMode === ViewMode.SDK &&
        Object.values(libraries)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((subLibrary) => (
            <LibraryNavigation
              library={subLibrary}
              openLibrary={match.params.libraryName}
              key={subLibrary.name}
            />
          ))}
    </Wrapper>
  );
};

export default NavigationView;
