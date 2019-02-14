import React from 'react';
import { message } from 'antd';
import { withRouter } from 'react-router-dom';

import { getUrlParams, getHeaders } from '../../utils';
import { PromotedResultsContext } from '../DataBrowser/PromotedResultsContainer';
import getPromotedURL from '../PromotedResultsQueries/utils';

class HideButton extends React.Component {
	state = {
		isLoading: false,
	};

	hideId = async () => {
		this.toggleLoading();
		const { id } = this.props;
		const { queryOperator, searchTerm, appname, rule, url } = getUrlParams(
			window.location.search,
		);
		const { appendHiddenResult } = this.context || undefined;

		const { promotedResults, hiddenResults } = this.context;

		let requestBody = {};

		requestBody = {
			if: {
				query: searchTerm,
				operator: queryOperator,
			},
			then: {
				hide: [
					...hiddenResults,
					{
						doc_id: id,
					},
				],
			},
		};

		if (promotedResults && promotedResults.length) {
			requestBody = {
				...requestBody,
				then: {
					...requestBody.then,
					promote: promotedResults,
				},
			};
		}

		// After first request we get the id from the API, which we append in the URL and pass it in Body
		if (rule) {
			requestBody = {
				...requestBody,
				id: rule,
			};
		}

		try {
			const requestURL = getPromotedURL(url);
			const { Authorization } = getHeaders(url);
			const ruleRequest = await fetch(`${requestURL}/${appname}/_rule`, {
				method: 'POST',
				headers: {
					Authorization,
				},
				body: JSON.stringify(requestBody),
			});

			const ruleResponse = await ruleRequest.json();
			if (ruleRequest.status >= 400) {
				message.error(ruleResponse.message);
			} else {
				if (!rule) {
					// Appending rule id to URL
					const {
						history,
						location: { pathname, search },
					} = this.props;
					history.push(
						`${pathname}${search}&rule=${ruleResponse.id}`,
					);
				}

				message.success('Query Rule Updated!');

				if (appendHiddenResult) {
					appendHiddenResult(id);
				}
			}
		} catch (e) {
			message.error('Something went Wrong!');
		}

		this.toggleLoading();
	};

	toggleLoading = () => {
		this.setState(prevState => ({
			isLoading: !prevState.isLoading,
		}));
	};

	render() {
		const { renderButton, id } = this.props;
		const { isLoading } = this.state;
		const { promotedResults, hiddenResults } = this.context;
		const promotedIds = promotedResults.map(
			promotedItem => promotedItem._id,
		);
		const hiddenIds = hiddenResults.map(hiddenItem => hiddenItem.doc_id);
		const isAlreadyPresent =
			promotedIds.includes(id) || hiddenIds.includes(id);
		return renderButton({
			hideItem: this.hideId,
			isLoading,
			disabled: isAlreadyPresent,
		});
	}
}

export default withRouter(HideButton);
HideButton.contextType = PromotedResultsContext;
