import { useState, useCallback, useEffect } from "react";
import { Slider } from "radix-ui";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

function App() {
	const [text, setText] = useState("");
	const [wpm, setWpm] = useState(120);

	const calculateReadingTime = (text: string) => {
		const words = text === "" ? 0 : text.trim().split(/\s+/).length;
		const minutes = words / wpm;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = Math.floor(minutes % 60);

		const seconds = Math.floor((minutes * 60) % 60);

		return { hours, minutes: remainingMinutes, seconds };
	};

	const onDrop = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = () => {
				const fileContent = reader.result as string;
				setText(fileContent);
			};
			reader.readAsText(file);
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
		onDrop,
		accept: {
			"text/plain": [".txt"],
		},
		noClick: true,
	});

	useEffect(() => {
		const value = localStorage.getItem("lastWpm");
		if (value && +value) {
			setWpm(+value);
		}
	}, []);

	const handleWPMChange = useCallback((value: number[]) => {
		setWpm(value[0]);
		localStorage.setItem("lastWpm", value[0].toString());
	}, []);

	const readingTime = calculateReadingTime(text);

	return (
		<div className='min-h-screen min-w-screen bg-gradient-custom text-zinc-100 p-8 place-content-center'>
			<div className='max-w-2xl flex flex-col justify-center my-auto mx-auto space-y-6 h-full'>
				<div className='flex flex-col gap-10 items-center justify-between'>
					<h1 className='text-2xl'>How Long To Read</h1>

					<div className='w-full'>
						<Slider.Root
							className='SliderRoot'
							defaultValue={[wpm]}
							value={[wpm]}
							max={250}
							min={60}
							step={5}
							onValueChange={handleWPMChange}
						>
							<Slider.Track className='SliderTrack'>
								<Slider.Range className='SliderRange' />
							</Slider.Track>
							<Slider.Thumb className='SliderThumb' aria-label='Volume'>
								<p className='absolute w-full text-center -top-6'>{wpm}</p>
							</Slider.Thumb>
						</Slider.Root>
						<div className='flex justify-between'>
							<p>60</p>
							<p className='font-medium border-t-2 border-white/40 mt-4'>
								{wpm} word per minute
							</p>
							<p>250</p>
						</div>
					</div>
				</div>

				<div
					{...getRootProps()}
					className={`border-2 border-dashed h-full bg-black/20 rounded-lg p-8 transition-colors ${
						isDragActive ? "border-blue-500 bg-blue-900/20" : "border-zinc-700"
					}`}
				>
					<input {...getInputProps()} />
					<textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='Вставьте текст сюда или перетащите текстовый файл...'
						className='w-full min-h-64 h-full p-4 bg-transparent outline-none resize-none text-zinc-100 placeholder-zinc-500'
					/>
				</div>

				<div className='flex flex-col items-center gap-4'>
					<div className='text-center text-lg'>
						Время чтения:{" "}
						<span className='font-medium'>
							{readingTime.hours > 0 && `${readingTime.hours} ч `}
							{readingTime.minutes > 0 && `${readingTime.minutes} мин `}
							{readingTime.seconds} сек
						</span>
					</div>
					<button
						onClick={open}
						className='inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors'
					>
						<Upload className='w-4 h-4' />
						Загрузить файл
					</button>
				</div>
			</div>
		</div>
	);
}

export default App;
