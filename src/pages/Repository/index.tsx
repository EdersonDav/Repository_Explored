/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Header, RepoInfo, Issues } from './style';
import logoImage from '../../assets/logo.svg';
import api from '../../services/api';

interface RepositoriesParams {
  repository: string;
}
interface Repository {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  title: string;
  id: number;
  html_url: string;
  user: {
    login: string;
  };
}
const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoriesParams>();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    async function loadData(): Promise<void> {
      const [repositor, issue] = await Promise.all([
        api.get(`repos/${params.repository}`),
        api.get(`repos/${params.repository}/issues`),
      ]);
      setRepository(repositor.data);
      setIssues(issue.data);
    }

    loadData();
  }, [params.repository]);
  return (
    <>
      <Header>
        <img src={logoImage} alt="Github Explored" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Back
        </Link>
      </Header>
      {repository && (
        <RepoInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong> <span>Stars</span>
            </li>
            <li>
              <strong>{repository.forks_count}</strong> <span>Forks</span>
            </li>
            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Open Issues</span>
            </li>
          </ul>
        </RepoInfo>
      )}
      <Issues>
        {issues.map(issue => (
          <a key={issue.id} href={issue.html_url} target="__blank">
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};
export default Repository;
