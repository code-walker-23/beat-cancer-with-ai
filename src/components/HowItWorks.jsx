import { howItWorks } from "@/lib/data";
const HowItWorks = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {howItWorks.map((step, index) => (
        <div className="text-center" key={index}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <span className="text-xl font-bold text-blue-600">{index + 1}</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold">{step.step}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItWorks;
