/* eslint-disable camelcase */
import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Title, Form, Repositories, Error } from './style';
import logoImage from '../../assets/logo.svg';

interface Repository {
  id: number;
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}
const Dashboard: React.FC = () => {
  const [searchRepo, setSearchRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const getRepositoriesStorage = localStorage.getItem(
      '@GitHubExplored:repositories',
    );
    if (getRepositoriesStorage) {
      return JSON.parse(getRepositoriesStorage);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GitHubExplored:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAppRepositories(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!searchRepo) {
      setInputError('Type it owner/name from repository');
      return;
    }
    try {
      const response = await api.get<Repository>(`repos/${searchRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);
      setSearchRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Error in repository search');
    }
  }
  return (
    <>
      <img src={logoImage} alt="Github Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAppRepositories}>
        <input
          value={searchRepo}
          onChange={e => setSearchRepo(e.target.value)}
          type="text"
          placeholder="Type it owner/name from repository"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.id} to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
