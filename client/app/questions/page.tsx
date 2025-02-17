"use client"

import { useQuery } from "@tanstack/react-query"
import { QuestionsResponse } from "@/types/question"

export default function QuestionsPage() {
    const { data, isLoading, error } = useQuery<QuestionsResponse>({
        queryKey: ['questions'],
        queryFn: async () => {
            const response = await fetch("http://localhost:3001/api/questions")
            if (!response.ok) throw new Error('Failed to fetch questions')
            return response.json()
        }
    })

    if (isLoading) return <div className="text-center p-8">Loading questions...</div>
    if (error) return <div className="text-red-500 p-8">Error: {error.message}</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Generated Questions</h1>
            <div className="space-y-6">
                {data?.map((question) => (
                    <div key={question._id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
                        <div className="space-y-2">
                            {question.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-md ${option === question.answer
                                            ? 'bg-green-100 border-2 border-green-500'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <p>Source: {question.pdfSource}</p>
                            <p>Created: {new Date(question.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}