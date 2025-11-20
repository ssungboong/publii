class GoogleCustomSearchEnginePlugin {
	constructor (API, name, config) {
		this.API = API;
		this.name = name;
		this.config = config;
	}

	addInsertions () {
		this.API.addInsertion('customSearchInput', this.addSearchInput, 1, this);
		this.API.addInsertion('customSearchContent', this.addSearchContent, 1, this);
	}

	addSearchInput (rendererInstance, context) {
		let searchUrl = '';
		let searchSubmitButtonInBox = '';
		let searchAutofocus = '';
		
		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			searchUrl = rendererInstance.globalContext.website.searchUrl;
		}

		if (this.config.searchSubmitButtonInBox) {
			searchSubmitButtonInBox = `<button type="submit" class="search__button"><span>
			   ${this.config.searchSubmitLabel}</span>
			</button>`;
		}

		if (this.config.searchAutofocus) {
			searchAutofocus = `autofocus`;
		}

		let output = `<form action="${searchUrl}" class="search__form">
                     <input
                        class="search__input"
                        type="search"
                        name="${this.config.searchParam}"
                        placeholder="${this.config.searchPlaceholder}" 
                        aria-label="${this.config.searchPlaceholder}"
                        ${searchAutofocus}/>
								${searchSubmitButtonInBox}
                  </form>`;

		return output;
	}

	addSearchContent (rendererInstance, context) {
		let searchUrl = '';
		let searchSubmitButtonOnPage = '';
		let cookieBannerGroup = 'text/javascript';
		let consentScriptToLoad = '';
		let consentNotice = '';
		
		if (rendererInstance.globalContext && rendererInstance.globalContext.website) {
			searchUrl = rendererInstance.globalContext.website.searchUrl;
		}

		if (this.config.cookieBannerIntegration) {
			cookieBannerGroup = 'gdpr-blocker/' + this.config.cookieBannerGroup.trim();
			consentScriptToLoad = `document.body.addEventListener('publii-cookie-banner-unblock-${this.config.cookieBannerGroup.trim()}', function () {
				document.getElementById('gcsr-no-consent-info').style.display = 'none';
			}, false);`;
			consentNotice = `<div
				data-gdpr-group="${cookieBannerGroup}"
				id="gcsr-no-consent-info" 
				style="background: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; color: #666; display: block; padding: 10px; text-align: center; width: 100%;">
				${this.config.cookieBannerNoConsentText}
			</div>`;
		}

		if (this.config.searchSubmitButtonOnPage) {
			searchSubmitButtonOnPage = `<button type="submit" class="search-page-button"><span>
					${this.config.searchSubmitLabel}</span>
				</button>`;
		}

		let output = `
			<form 
				action="${searchUrl}" 
				class="search-page-form">
				<input
					type="search"
					name="${this.config.searchParam}"
					placeholder="${this.config.searchPlaceholder}"
					class="search-page-input"/>
				${searchSubmitButtonOnPage}
			</form>

			${consentNotice}

			<script type="${cookieBannerGroup}">
				(function () {
					var cx = '${this.config.searchId}';
					var gcse = document.createElement('script');
					gcse.type  = 'text/javascript';
					gcse.async = true;
					gcse.src   = 'https://cse.google.com/cse.js?cx=' + cx;
					var s = document.getElementsByTagName('script')[0];
					s.parentNode.insertBefore(gcse, s);
				})();
			</script>

			<gcse:searchresults-only></gcse:searchresults-only>

			<script type="text/javascript">
				${consentScriptToLoad}
			</script>
		`;

		return output;
	}
}

module.exports = GoogleCustomSearchEnginePlugin;
