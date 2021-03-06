// @flow

import React from 'react';
import { Skeleton } from 'antd';
import { connect } from 'react-redux';
import { bool } from 'prop-types';

import DataBrowser from '../DataBrowser';

import { getIsLoading, getIsConnected } from '../../reducers/app';

type Props = {
	isConnected: boolean,
	isLoading: boolean,
	hasCloneApp: boolean,
};

const DataBrowserContainer = ({ isConnected, isLoading, hasCloneApp }: Props) => (
	<Skeleton loading={isLoading} active>
		{isConnected && <DataBrowser hasCloneApp={hasCloneApp} />}
	</Skeleton>
);

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
});

DataBrowserContainer.propTypes = {
	isLoading: bool.isRequired,
	isConnected: bool.isRequired,
};

export default connect(mapStateToProps)(DataBrowserContainer);
