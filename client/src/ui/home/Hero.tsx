
import heroImg from "../../assets/img/hero.png";

import Button from "../Button";

export default function Hero() {
  return (
    <section className="  " id="heroSection">
      <div className=" max-w-screen-xl px-4 py-12  lg:h-screen  ">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 h-full mx-auto">
          <div className=" rounded-lg lg:flex  lg:items-center">
            <div className="mx-auto max-w-3xl text-center text-box">
              <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                Better Healthcare for a 
                <span className="sm:block"> Better Life. </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                Your health is our priority. Find the best care and live a
                healthier life.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button content="Get Started" key={1} link="/ai-chat" />
                <Button content="Learn More" key={2} type="border" link="/groups" />
              </div>
            </div>
          </div>
          <div
            className=" rounded-lg  bg-cover bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
