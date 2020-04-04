import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import {
  USERS_MANAGER_PAGE_HEADING,
  LOAD_MORE_TEXT
} from "../config/strings.js";
import UserDetails from "./UserDetails.js";
import { useExecuteGraphQLQuery } from "./CustomHooks.js";

const UsersManager = props => {
  const [usersSummary, setUsersSummary] = useState({
    count: 0,
    verified: 0,
    admins: 0,
    creators: 0
  });
  const [usersPaginationOffset, setUsersPaginationOffset] = useState(1);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const executeGQLCall = useExecuteGraphQLQuery();

  useEffect(() => {
    loadUsersSummary();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [usersPaginationOffset]);

  const loadUsersSummary = async () => {
    const query = `
    query {
      summary: getUsersSummary {
        count,
        verified,
        admins,
        creators
      }
    }
    `;
    try {
      const response = await executeGQLCall(query);
      if (response.summary) {
        setUsersSummary({
          count: response.summary.count,
          verified: response.summary.verified,
          admins: response.summary.admins,
          creators: response.summary.creators
        });
        // creatorCoursesPaginationOffset += 1
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadUsers = async () => {
    const query = `
    query c {
      users: getSiteUsers(searchData: {
        offset: ${usersPaginationOffset}
      }) {
        id,
        email,
        name,
        verified,
        isCreator,
        isAdmin,
        avatar,
        purchases,
        active
      }
    }
    `;
    try {
      const response = await executeGQLCall(query);
      if (response.users && response.users.length > 0) {
        setUsers([...users, ...response.users]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = event => {
    event.preventDefault();
  };

  const onLoadMoreClick = () =>
    setUsersPaginationOffset(usersPaginationOffset + 1);

  return (
    <Grid container direction="column">
      <Grid
        item
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={8}>
          <Typography variant="h3">{USERS_MANAGER_PAGE_HEADING}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <form onSubmit={handleSearch}>
            <TextField
              value={searchText}
              variant="outlined"
              label=""
              fullWidth
              margin="normal"
              placeholder={`Search in ${usersSummary.count} users`}
              onChange={e => setSearchText(e.target.value)}
            />
          </form>
        </Grid>
      </Grid>
      <Grid item>
        {users.map(user => (
          <UserDetails user={user} key={user.id} />
        ))}
      </Grid>
      <Grid item>
        <Button onClick={onLoadMoreClick}>{LOAD_MORE_TEXT}</Button>
      </Grid>
    </Grid>
  );
};

export default UsersManager;
