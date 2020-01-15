import React, { Component } from 'react';

import { ConnectAppWithStore } from '@appbaseio/dejavu-browser';
import Navigation from './Navigation';

class NavigationWrapper extends Component {
	state = {
		isConnected: false,
		indices: [],
	};

	setValue = (key, value) => this.setState({ [key]: value });

	render() {
		const { isConnected, indices } = this.state;
		return (
			<div>
				<Navigation indexes={indices} isConnected={isConnected} />
				<ConnectAppWithStore>
					{({ connected, indexes }) => (
						<DummyChild
							connected={connected}
							indices={indexes}
							updateConnectedState={val =>
								this.setValue('isConnected', val)
							}
							updateIndices={val => this.setValue('indices', val)}
						/>
					)}
				</ConnectAppWithStore>
			</div>
		);
	}
}

class DummyChild extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.connected !== prevProps.connected) {
			this.props.updateConnectedState(this.props.connected);
		}
		if (this.props.indices !== prevProps.indices) {
			this.props.updateIndices(this.props.indices);
		}
	}

	render() {
		return <></>;
	}
}

export default NavigationWrapper;
