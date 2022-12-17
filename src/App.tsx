import React, { FC, FormEvent, useState } from "react";

const App: FC = () => {
	const [inputText, setInputText] = useState("");
	const [inputToken, setInputToken] = useState("");
	const [fetchResult, setFetchResult] = useState<string | null>(null);
	const [fetchLoading, setFetchLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const formHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setFetchLoading(true);
		setFetchResult(null);

		const body = JSON.stringify({ input: inputText });

		try {
			const respnose = fetch("https://djadwnui9f.execute-api.eu-west-1.amazonaws.com/dlohunov/chat", {
				method: "POST",
				body: body,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Basic ${inputToken}`,
				},
			});
			const data = (await (await respnose).json()) as { output: string };

			setFetchResult(data.output);
			setFetchLoading(false);
		} catch (error) {
			if (error instanceof Error) {
				setFetchError(error.message);
			}
			setFetchLoading(false);
		}
	};

	return (
		<>
			<header className="header">
				<div className="container">
					<div className="logo">
						<img className="logo__img" src="/logo.png" srcSet="/logo@2x.png 2x" alt="Smoothly" />
					</div>
				</div>
			</header>
			<main className="main">
				<div className="container">
					<form className="form" onSubmit={formHandler}>
						<label htmlFor="text" className="form__label">
							Enter text
							<input
								id="text"
								type="text"
								name="iput"
								value={inputText}
								required
								onChange={(event) => setInputText(event.target.value)}
								className="form__input"
								placeholder="Text"
							/>
						</label>
						<label htmlFor="text" className="form__label">
							Password
							<input
								id="text"
								type="password"
								name="token"
								value={inputToken}
								required
								onChange={(event) => setInputToken(event.target.value)}
								className="form__input"
								placeholder="Password"
							/>
						</label>
						<button type="submit" className="btn" disabled={fetchLoading || !!fetchError}>
							{fetchLoading ? "Loading" : "Submit"}
						</button>
						<output className="form__output">{fetchResult && `${fetchResult}`}</output>
						<p>{fetchError && fetchResult}</p>
					</form>
				</div>
			</main>
		</>
	);
};

export default App;
