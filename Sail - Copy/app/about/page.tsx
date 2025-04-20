import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About SAIL</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Company</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Steel Authority of India Limited (SAIL) is one of the largest steel-making companies in India and one
                  of the Maharatnas of the country's Central Public Sector Enterprises. SAIL produces iron and steel at
                  five integrated plants and three special steel plants, located principally in the eastern and central
                  regions of India and situated close to domestic sources of raw materials.
                </p>
                <p>
                  SAIL manufactures and sells a broad range of steel products, including hot and cold rolled sheets and
                  coils, galvanized sheets, electrical sheets, structural, railway products, plates, bars and rods,
                  stainless steel and other alloy steels. SAIL produces iron and steel at five integrated plants and
                  three special steel plants, located principally in the eastern and central regions of India and
                  situated close to domestic sources of raw materials.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Vision & Mission</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">Vision</h3>
                  <p>
                    To be a respected world-class corporation and the leader in Indian steel business in quality,
                    productivity, profitability and customer satisfaction.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Mission</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To provide quality steel products and services for our customers' satisfaction.</li>
                    <li>To generate adequate returns on the capital employed.</li>
                    <li>To develop a technologically up-to-date and innovative organization.</li>
                    <li>
                      To promote a culture of trust and continuous learning while meeting the expectations of
                      stakeholders.
                    </li>
                    <li>
                      To be a responsible corporate citizen, creating value for the community and the environment.
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Plants</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  SAIL's integrated steel plants are located at Bhilai (Chhattisgarh), Rourkela (Odisha), Durgapur (West
                  Bengal), Bokaro (Jharkhand) and Burnpur (West Bengal).
                </p>
                <p className="mb-4">
                  The special steel plants are located at Salem (Tamil Nadu), Durgapur (West Bengal) and Bhadravati
                  (Karnataka). A Ferro Alloy plant at Chandrapur (Maharashtra) is also part of SAIL.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {[
                    "Bhilai Steel Plant",
                    "Rourkela Steel Plant",
                    "Durgapur Steel Plant",
                    "Bokaro Steel Plant",
                    "IISCO Steel Plant",
                    "Salem Steel Plant",
                  ].map((plant) => (
                    <div key={plant} className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-medium">{plant}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Corporate Social Responsibility</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  SAIL's social objective is synonymous with Corporate Social Responsibility (CSR). Apart from the
                  business of manufacturing steel, the objective of the company is to conduct business in ways that
                  produce social, environmental and economic benefits to the communities in which it operates.
                </p>
                <p>
                  For any industrial organization, earning profit is the prime objective but for SAIL, it is not the
                  only objective. SAIL's objectives are in line with the vision of its founding fathers, which is to lay
                  the foundation for a strong and self-reliant India. SAIL has been a forerunner in the area of
                  corporate citizenship and has been contributing to the society through various CSR initiatives.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

