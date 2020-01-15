// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	FlashMessage as ErrorFlashMessage,
	ConnectAppWithStore,
	appReducers,
	utils,
} from '@appbaseio/dejavu-browser';

import SearchSandbox from '../batteries/components/SearchSandbox';
import BaseContainer from '../batteries/components/BaseContainer';
import Editor from '../batteries/components/SearchSandbox/containers/Editor';

const { getIsConnected, getAppname, getUrl } = appReducers;
const { parseUrl } = utils;

type Props = {
	isConnected: boolean,
	appName?: string,
	rawUrl?: string,
};

class SearchPreview extends Component<Props> {
	state = { isConnected: false, appName: null, rawUrl: '' };

	setValue = (key, value) => this.setState({ [key]: value });

	render() {
		const { isConnected, appName, rawUrl } = this.state;
		const { credentials, url } = parseUrl(rawUrl);
		return (
			<section>
				<ErrorFlashMessage />
				<ConnectAppWithStore>
					{({ connected, appname, url }) => (
						<DummyChild
							connected={connected}
							appname={appname}
							url={url}
							updateConnectedState={val =>
								this.setValue('isConnected', val)
							}
							updateAppName={val => this.setValue('appName', val)}
							updateRawUrl={val => this.setValue('rawUrl', val)}
						/>
					)}
				</ConnectAppWithStore>
				<ConnectAppWithStore />
				{isConnected && appName && (
					<BaseContainer
						appName={appName}
						shouldFetchAppPlan={false}
						shouldFetchAppInfo={false}
						url={url}
					>
						<SearchSandbox
							appName={appName}
							credentials={credentials}
							url={url}
						>
							<Editor mappingsURL="https://opensource.appbase.io/dejavu/mappings" />
						</SearchSandbox>
					</BaseContainer>
				)}
			</section>
		);
	}
}

class DummyChild extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.connected !== prevProps.connected) {
			this.props.updateConnectedState(this.props.connected);
		}
		if (this.props.appname !== prevProps.appname) {
			this.props.updateAppName(this.props.appname);
		}
		if (this.props.url !== prevProps.url) {
			this.props.updateRawUrl(this.props.url);
		}
	}

	render() {
		return <></>;
	}
}

const mapStateToProps = state => ({
	// isConnected: getIsConnected(state),
	// appName: getAppname(state),
	// rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(SearchPreview);
