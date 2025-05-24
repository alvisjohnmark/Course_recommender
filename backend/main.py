from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss
from fastapi.responses import PlainTextResponse
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import httpx
import logging


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')


courses = [{'title': 'Bachelor of Science in Computer Science', 'description': 'Algorithms, programming, AI, and systems software.'}, {'title': 'Bachelor of Science in Information Technology', 'description': 'IT infrastructure, networking, databases, and cybersecurity.'}, {'title': 'Bachelor of Science in Information Systems', 'description': 'Business technology integration, systems analysis, and data management.'}, {'title': 'Bachelor of Science in Software Engineering', 'description': 'Software lifecycle, development, QA, and project management.'}, {'title': 'Bachelor of Science in Data Science', 'description': 'Data analysis, statistics, machine learning, and visualization.'}, {'title': 'Bachelor of Science in Cybersecurity', 'description': 'Threat analysis, digital forensics, and security protocols.'}, {'title': 'Bachelor of Science in Artificial Intelligence', 'description': 'Deep learning, NLP, robotics, and AI ethics.'}, {'title': 'Bachelor of Science in Game Development', 'description': 'Game design, graphics programming, and physics engines.'}, {'title': 'Bachelor of Science in Robotics', 'description': 'Automation, mechatronics, embedded systems, and AI integration.'}, {'title': 'Bachelor of Science in Human-Computer Interaction', 'description': 'Usability, UI/UX design, and cognitive ergonomics.'}, {'title': 'Bachelor of Science in Cloud Computing', 'description': 'Distributed systems, cloud services, and virtualization.'}, {'title': 'Bachelor of Science in Blockchain and Financial Technology', 'description': 'Cryptocurrency systems, smart contracts, and fintech innovation.'}, {'title': 'Bachelor of Science in Electrical Engineering', 'description': 'Circuits, electromagnetism, signal systems.'}, {'title': 'Bachelor of Science in Electronics Engineering', 'description': 'Semiconductor devices, embedded systems, and communications.'}, {'title': 'Bachelor of Science in Mechanical Engineering', 'description': 'Kinematics, thermal systems, and robotics.'}, {'title': 'Bachelor of Science in Civil Engineering', 'description': 'Construction, structures, transportation, and geotechnics.'}, {'title': 'Bachelor of Science in Architecture', 'description': 'Structural design, architectural theory, and urban design.'}, {'title': 'Bachelor of Science in Chemical Engineering', 'description': 'Industrial chemistry, plant design, and process simulation.'}, {'title': 'Bachelor of Science in Biomedical Engineering', 'description': 'Biomechanics, biosensors, and medical imaging.'}, {'title': 'Bachelor of Science in Aerospace Engineering', 'description': 'Aircraft design, aerodynamics, and propulsion systems.'}, {'title': 'Bachelor of Science in Environmental Engineering', 'description': 'Waste treatment, environmental planning, and sustainability.'}, {'title': 'Bachelor of Science in Marine Engineering', 'description': 'Ship propulsion systems, thermodynamics, and marine maintenance.'}, {'title': 'Bachelor of Science in Biology', 'description': 'Cell biology, ecology, genetics, and molecular biology.'}, {'title': 'Bachelor of Science in Marine Biology', 'description': 'Aquatic ecosystems, marine biodiversity, and conservation.'}, {'title': 'Bachelor of Science in Physics', 'description': 'Mechanics, quantum theory, and electromagnetism.'}, {'title': 'Bachelor of Science in Chemistry', 'description': 'Organic, inorganic, physical, and analytical chemistry.'}, {'title': 'Bachelor of Science in Mathematics', 'description': 'Calculus, algebra, statistics, and mathematical modeling.'}, {'title': 'Bachelor of Science in Statistics', 'description': 'Data analysis, sampling theory, and statistical computing.'}, {'title': 'Bachelor of Science in Environmental Science', 'description': 'Ecology, environmental policy, and resource management.'}, {'title': 'Bachelor of Science in Genetic Engineering', 'description': 'Gene editing, molecular genetics, and biotechnology.'}, {'title': 'Bachelor of Science in Cognitive Science', 'description': 'Neuroscience, psychology, AI, and linguistics.'}, {'title': 'Bachelor of Science in Nursing', 'description': 'Clinical care, patient safety, and pharmacology.'}, {'title': 'Bachelor of Science in Public Health', 'description': 'Epidemiology, global health, and health policy.'}, {'title': 'Bachelor of Science in Health Sciences', 'description': 'Healthcare systems, clinical foundations, and wellness promotion.'}, {'title': 'Bachelor of Science in Physical Therapy', 'description': 'Biomechanics, rehabilitation, and physical assessment.'}, {'title': 'Bachelor of Science in Occupational Therapy', 'description': 'Functional training and therapy planning.'}, {'title': 'Bachelor of Science in Medical Technology', 'description': 'Laboratory diagnostics, microbiology, and hematology.'}, {'title': 'Bachelor of Science in Nutrition and Dietetics', 'description': 'Metabolism, clinical nutrition, and food science.'}, {'title': 'Bachelor of Science in Pharmacy', 'description': 'Drug chemistry, therapeutics, and pharmaceutical law.'}, {'title': 'Bachelor of Science in Radiologic Technology', 'description': 'Imaging physics, radiography, and radiologic safety.'}, {'title': 'Bachelor of Science in Respiratory Therapy', 'description': 'Pulmonary care, ventilator management, and cardiopulmonary diagnostics.'}, {'title': 'Bachelor of Science in Midwifery', 'description': 'Maternal and child health, prenatal care, and labor management.'}, {'title': 'Bachelor of Science in Dental Technology', 'description': 'Dental materials, prosthodontics, and oral anatomy.'}, {'title': 'Bachelor of Science in Medical Laboratory Science', 'description': 'Clinical diagnostics, pathology, and quality assurance.'}, {'title': 'Bachelor of Science in Disaster Risk Management', 'description': 'Emergency response, risk reduction, and public health preparedness.'}, {'title': 'Bachelor of Science in Business Administration', 'description': 'Finance, marketing, operations, and entrepreneurship.'}, {'title': 'Bachelor of Science in Finance', 'description': 'Investment analysis, corporate finance, and financial planning.'}, {'title': 'Bachelor of Science in Accounting', 'description': 'Auditing, taxation, cost accounting, and financial reporting.'}, {'title': 'Bachelor of Science in Marketing', 'description': 'Branding, digital strategy, consumer behavior, and analytics.'}, {'title': 'Bachelor of Science in Entrepreneurship', 'description': 'Startups, innovation, and venture capital management.'}, {'title': 'Bachelor of Science in Business Analytics', 'description': 'Predictive modeling, dashboarding, and KPI evaluation.'}, {'title': 'Bachelor of Science in E-Commerce', 'description': 'Online business, payment systems, and digital logistics.'}, {'title': 'Bachelor of Science in Real Estate Management', 'description': 'Property valuation, brokerage, and land use laws.'}, {'title': 'Bachelor of Science in Supply Chain Management', 'description': 'Logistics, procurement, inventory, and distribution.'}, {'title': 'Bachelor of Science in Hospitality Management', 'description': 'Hotel and restaurant operations, service management.'}, {'title': 'Bachelor of Science in Tourism Management', 'description': 'Tour operations, travel planning, and destination marketing.'}, {'title': 'Bachelor of Science in Aviation', 'description': 'Flight operations, aeronautics, and air traffic regulations.'}, {'title': 'Bachelor of Science in Marine Transportation', 'description': 'Seamanship, navigation, and maritime safety.'}, {'title': 'Bachelor of Science in Cruise Line Operations', 'description': 'Onboard services, hospitality, and maritime tourism.'}, {'title': 'Bachelor of Science in Culinary Arts Management', 'description': 'Kitchen operations, nutrition, and food service leadership.'}, {'title': 'Bachelor of Education', 'description': 'Educational theory, curriculum design, and pedagogical techniques.'}, {'title': 'Bachelor of Arts in Psychology', 'description': 'Behavioral science, developmental, clinical, and cognitive psychology.'}, {'title': 'Bachelor of Social Work', 'description': 'Community service, social justice, counseling, and casework.'}, {'title': 'Bachelor of Arts in Sociology', 'description': 'Social systems, deviance, and cultural change.'}, {'title': 'Bachelor of Arts in Anthropology', 'description': 'Human evolution, ethnography, and sociocultural analysis.'}, {'title': 'Bachelor of Arts in Political Science', 'description': 'Governance, policy-making, political theory, and diplomacy.'}, {'title': 'Bachelor of Arts in Public Administration', 'description': 'Bureaucracy, policy formulation, and organizational theory.'}, {'title': 'Bachelor of Science in Legal Management', 'description': 'Legal principles, corporate law, and business governance.'}, {'title': 'Bachelor of Science in Paralegal Studies', 'description': 'Legal writing, litigation support, and case preparation.'}, {'title': 'Bachelor of Arts in International Relations', 'description': 'Diplomacy, conflict resolution, and foreign policy.'}, {'title': 'Bachelor of Arts in Development Studies', 'description': 'Poverty alleviation, NGOs, and sustainable development.'}, {'title': 'Bachelor of Arts in Gender Studies', 'description': 'Gender theory, equality movements, and intersectionality.'}]

# Prepare embedding from course descriptions
descriptions = [
    f"{course['title']}. {course['description']}"
    for course in courses
]
course_embeddings = model.encode(descriptions, convert_to_numpy=True)

faiss.normalize_L2(course_embeddings)
index = faiss.IndexFlatIP(course_embeddings.shape[1])
index.add(course_embeddings)


class Query(BaseModel):
    text: str
    k: int = 3

@app.post("/recommend")
def recommend(query: Query):
    query_embedding = model.encode([query.text], convert_to_numpy=True)
    faiss.normalize_L2(query_embedding)

    D, I = index.search(query_embedding, k=query.k)
    recommendations = []
    for idx, score in zip(I[0], D[0]):
        course = courses[idx]
        recommendations.append({
            "title": course["title"],
            "description": course["description"],
            "score": round(float(score), 4)
        })

    return {"recommendations": recommendations}



@app.get("/api/ping", response_class=PlainTextResponse)
async def ping():
    return "ping"


@app.on_event("startup")
async def start_pinging():
    async def ping_loop():
        url = "http://localhost:8000/api/ping" 
        while True:
            try:
                async with httpx.AsyncClient() as client:
                    res = await client.get(url)
                    logging.info(f"Pinged backend: {res.status_code}")
            except Exception as e:
                logging.error(f"Error pinging backend: {e}")
            await asyncio.sleep(14 * 60)  

    asyncio.create_task(ping_loop())
