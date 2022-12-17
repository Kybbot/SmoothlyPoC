import { ChangeEvent, FC, FormEvent, useState } from "react";

const App: FC = () => {
	const [formState, setFormState] = useState({
		input: "",
		maxTokens: 3500,
		temperature: 0,
	});
	const [inputToken, setInputToken] = useState("");

	const [fetchResult, setFetchResult] = useState<string | null>(null);
	const [fetchLoading, setFetchLoading] = useState(false);
	const [fetchError, setFetchError] = useState<string | null>(null);

	const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const formHandler = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setFetchLoading(true);
		setFetchResult(null);

		const body = JSON.stringify({
			input: formState.input,
			maxTokens: +formState.maxTokens,
			temperature: +formState.temperature,
		});

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
								name="input"
								value={formState.input}
								required
								onChange={inputHandler}
								className="form__input"
								placeholder="Text"
							/>
						</label>
						<label htmlFor="maxLength" className="form__label">
							Max length
							<input
								id="maxLength"
								type="number"
								name="maxTokens"
								min={1}
								required
								value={formState.maxTokens}
								inputMode="numeric"
								onChange={inputHandler}
								className="form__input"
								placeholder="Max length"
							/>
						</label>
						<label htmlFor="temperature " className="form__label">
							Temperature - {formState.temperature}
							<input
								id="temperature"
								type="range"
								name="temperature"
								min="0"
								max="1"
								step="0.1"
								value={formState.temperature}
								onChange={inputHandler}
								className="form__input"
							/>
						</label>
						<label htmlFor="password" className="form__label">
							Password
							<input
								id="password"
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
