import * as React from "react"
import Layout from "../components/layout"
import Compass from "../components/compass"

const IndexPage = () => {
	return (
		<Layout>
			<div 
				className="columns is-mobile is-vcentered"
				style={{
					minHeight: "100vh"
				}}>
				<div className="column is-6">
					<div className="box has-background-info">
						<Compass />
					</div>
					
				</div>
				<div className="column is-6">
					<div className="box">
						<section className="section">
							<div className="content has-text-centered">
								<p>
									Skriv in en plats i rutan till vänster!
								</p>
							</div>
						</section>
					</div>
				</div>
			</div>
			
		</Layout>
  	)
}

export default IndexPage
