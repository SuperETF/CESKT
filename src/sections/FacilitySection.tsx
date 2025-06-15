import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Facility {
  id: string;
  name: string;
  address: string;
  hours: string;
  image_url: string;
  link_url?: string;
}

export default function FacilitySection() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, address, hours, image_url, link_url")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("시설 데이터 불러오기 실패:", error.message);
      } else {
        setFacilities(data || []);
      }

      setLoading(false);
    };

    fetchFacilities();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">시설 정보를 불러오는 중...</div>;
  }

  return (
    <section className="w-full py-8 px-4 bg-white">
      <h2 className="text-2xl font-bold text-[#1A1B35] mb-6">제휴 운동시설</h2>

      {facilities.map((facility) => (
        <div
          key={facility.id}
          className="mb-8 transition-transform duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
          onClick={() => {
            if (facility.link_url) {
              window.open(facility.link_url, "_blank");
            }
          }}
        >
          <div className="h-48 rounded-lg overflow-hidden mb-4 shadow-md">
            <img
              src={facility.image_url}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-lg mb-2 text-[#1A1B35]">{facility.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <i className="fas fa-map-marker-alt mr-1"></i> {facility.address}
            </p>
            <p>
              <i className="fas fa-clock mr-1"></i> {facility.hours}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
