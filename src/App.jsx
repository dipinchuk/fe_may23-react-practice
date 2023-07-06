import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getCategoryById(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId)
    || null;
}

function getOwnerById(categoryId) {
  const foundCategoty = getCategoryById(categoryId);

  return usersFromServer.find(user => user.id === foundCategoty.ownerId)
    || null;
}

const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId), // find by product.categoryId
  user: getOwnerById(product.categoryId), // find by category.ownerId
}));

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [query, setQuery] = useState(null);
  let visibleProducts = [...products];

  switch (selectedUser) {
    case 'All':
      break;
    default:
      visibleProducts = visibleProducts
        .filter(product => product.user.name === selectedUser);
  }

  if (query) {
    const normalizedQuery = query.toLowerCase();

    visibleProducts = visibleProducts.filter(
      product => product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames(
                  { 'is-active': selectedUser === 'All' },
                )}
                onClick={() => {
                  setSelectedUser('All');
                }}
              >
                All
              </a>

              {
                usersFromServer.map(user => (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    className={classNames(
                      { 'is-active': selectedUser === user.name },
                    )}
                    onClick={() => {
                      setSelectedUser(user.name);
                    }}
                  >
                    {user.name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  query && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => setQuery(null)}
                      />
                    </span>
                  )
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {
                categoriesFromServer.map(category => (
                  <a
                    data-cy="Category"
                    className={classNames('button mr-2 my-1', {
                      'is-info': selectedCategory.includes(category.title),
                    })}
                    href="#/"
                    onClick={() => setSelectedCategory(category.title)}
                  >
                    {category.title}
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUser('All');
                  setSelectedCategory([]);
                  setQuery(null);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {
            visibleProducts.length === 0 ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )

              : (

                <table
                  data-cy="ProductTable"
                  className="table is-striped is-narrow is-fullwidth"
                >
                  <thead>
                    <tr>
                      <th>
                        <span className="is-flex is-flex-wrap-nowrap">
                          ID

                          <a href="#/">
                            <span className="icon">
                              <i data-cy="SortIcon" className="fas fa-sort" />
                            </span>
                          </a>
                        </span>
                      </th>

                      <th>
                        <span className="is-flex is-flex-wrap-nowrap">
                          Product

                          <a href="#/">
                            <span className="icon">
                              <i
                                data-cy="SortIcon"
                                className="fas fa-sort-down"
                              />
                            </span>
                          </a>
                        </span>
                      </th>

                      <th>
                        <span className="is-flex is-flex-wrap-nowrap">
                          Category

                          <a href="#/">
                            <span className="icon">
                              <i
                                data-cy="SortIcon"
                                className="fas fa-sort-up"
                              />
                            </span>
                          </a>
                        </span>
                      </th>

                      <th>
                        <span className="is-flex is-flex-wrap-nowrap">
                          User

                          <a href="#/">
                            <span className="icon">
                              <i data-cy="SortIcon" className="fas fa-sort" />
                            </span>
                          </a>
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      visibleProducts.map(product => (
                        <tr data-cy="Product">
                          <td
                            className="has-text-weight-bold"
                            data-cy="ProductId"
                          >
                            {product.id}
                          </td>

                          <td data-cy="ProductName">{product.name}</td>
                          <td data-cy="ProductCategory">{`${product.category.icon}- ${product.category.title}`}</td>

                          <td
                            data-cy="ProductUser"
                            className={classNames({
                              'has-text-link': product.user.sex === 'm',
                              'has-text-danger': product.user.sex === 'f',
                            })}
                          >
                            {product.user.name}
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>

              )
          }
        </div>
      </div>
    </div>
  );
};
