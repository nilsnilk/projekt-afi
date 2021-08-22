import * as React from 'react'
import '../mystyles.scss'

const Layout = ({ pageTitle, children }) => {
	return (
		<div className="has-background-dark" style={{
			height: "",
		}}>
			<title>{pageTitle}</title>
			<div className="columns is-centered">
				<div className="column is-8">
					<main>{children}</main>
				</div>
			</div>		
		</div>
	)
}

export default Layout