import { useState } from "react";

interface Question {
	id: number;
	pergunta: string;
	resposta: string;
	dicas: string;
	referencia: string;
}

interface QuestionListProps {
	questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
	const [activeId, setActiveId] = useState<number | null>(null);
	const [activeTab, setActiveTab] = useState<string | null>(null);

	const handleToggle = (id: number, tab: string) => {
		if (activeId === id && activeTab === tab) {
			setActiveId(null);
			setActiveTab(null);
		} else {
			setActiveId(id);
			setActiveTab(tab);
		}
	};

	return (
		<div id="questions">
			{questions.map((q) => (
				<div key={q.id} className="question-item">
					<div className="question-header">
						<div className="question-number">{q.id}</div>
						<div className="question-content">
							<p className="question-text">{q.pergunta}</p>
							<div className="question-buttons">
								<button
									type="button"
									className={`q-btn btn-resposta ${activeId === q.id && activeTab === "answer" ? "active" : ""}`}
									onClick={() => handleToggle(q.id, "answer")}
								>
									Resposta
								</button>
								<button
									type="button"
									className={`q-btn btn-dicas ${activeId === q.id && activeTab === "dicas" ? "active" : ""}`}
									onClick={() => handleToggle(q.id, "dicas")}
								>
									Dicas
								</button>
								<button
									type="button"
									className={`q-btn btn-referencia ${activeId === q.id && activeTab === "referencia" ? "active" : ""}`}
									onClick={() => handleToggle(q.id, "referencia")}
								>
									Referência
								</button>
							</div>
						</div>
					</div>
					<div
						className={`answer-content answer-${q.id} ${activeId === q.id && activeTab === "answer" ? "open" : ""}`}
					>
						<div className="block-label">Resposta</div>
						<p>{q.resposta}</p>
					</div>
					<div
						className={`dicas-content dicas-${q.id} ${activeId === q.id && activeTab === "dicas" ? "open" : ""}`}
					>
						<div className="block-label">Dicas</div>
						<p>{q.dicas}</p>
					</div>
					<div
						className={`referencia-content referencia-${q.id} ${activeId === q.id && activeTab === "referencia" ? "open" : ""}`}
					>
						<div className="block-label">Referência</div>
						<p>{q.referencia}</p>
					</div>
				</div>
			))}
		</div>
	);
}
