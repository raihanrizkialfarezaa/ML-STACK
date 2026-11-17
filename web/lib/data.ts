import rawData from "@/data/wine_hybrid_data.json";
import { WineDataBundle } from "@/types";

export const wineData: WineDataBundle = rawData as unknown as WineDataBundle;

export const FEATURE_INFO: Record<
  string,
  {
    nameId: string;
    description: string;
    layman: string;
    impact: string;
    unit: string;
    typicalRange: [number, number];
  }
> = {
  alcohol: {
    nameId: "Kadar Alkohol",
    description: "Persentase volume etanol per total volume wine.",
    layman:
      "Kekuatan dan sensasi hangat wine saat diminum. Wine dengan alkohol lebih tinggi cenderung terasa lebih 'berbobot' dan matang.",
    impact:
      "Faktor prediktor nomor 1 kualitas wine di hampir semua model klasifikasi.",
    unit: "% vol",
    typicalRange: [8.0, 14.5],
  },
  "volatile acidity": {
    nameId: "Keasaman Terbang (Asam Asetat)",
    description: "Jumlah asam asetat yang mudah menguap di dalam wine.",
    layman:
      "Aroma dan rasa seperti cuka dapur. Jika terlalu tinggi, wine terasa menyengat, tengik, dan dinilai cacat/rusak.",
    impact:
      "Korelasi negatif sangat kuat dengan kualitas: semakin tinggi asam asetat, semakin jatuh kualitas wine.",
    unit: "g(acetic acid)/dm³",
    typicalRange: [0.1, 1.2],
  },
  sulphates: {
    nameId: "Sulfat (Kalium Sulfat)",
    description:
      "Bahan aditif pembantu sulfur dioksida yang bertindak sebagai agen anti-mikroba dan antioksidan.",
    layman:
      "Pengawet alami yang menjaga kesegaran wine agar tidak teroksidasi dan berubah menjadi bau busuk.",
    impact:
      "Sangat penting bagi Red Wine untuk kestabilan warna dan preservasi aroma buah.",
    unit: "g(potassium sulphate)/dm³",
    typicalRange: [0.3, 1.5],
  },
  density: {
    nameId: "Massa Jenis (Densitas)",
    description:
      "Kerapatan massa wine per volume, sangat dipengaruhi oleh gula dan alkohol.",
    layman:
      "Kekentalan wine. Air = 1.0. Alkohol menurunkan densitas (<1.0), sedangkan gula menaikkan densitas (>1.0).",
    impact:
      "Wine berkualitas tinggi umumnya memiliki alkohol tinggi dan fermentasi tuntas, menghasilkan densitas lebih rendah.",
    unit: "g/cm³",
    typicalRange: [0.987, 1.003],
  },
  chlorides: {
    nameId: "Klorida (Garam)",
    description: "Jumlah garam terlarut (terutama natrium klorida) dalam wine.",
    layman:
      "Rasa asin atau payau. Berasal dari mineral tanah tempat anggur tumbuh atau air irigasi.",
    impact:
      "Klorida rendah sangat diinginkan, terutama pada White Wine, agar rasa buah tetap segar dan tidak berasa asin aneh.",
    unit: "g(sodium chloride)/dm³",
    typicalRange: [0.01, 0.2],
  },
  "citric acid": {
    nameId: "Asam Sitrat",
    description:
      "Asam organik dalam jumlah kecil yang memberikan karakter kesegaran citrus.",
    layman:
      "Rasa segar seperti perasan jeruk nipis/lemon yang membuat wine terasa 'hidup' dan tidak hambar.",
    impact:
      "Menambah kompleksitas rasa dan membantu mencegah kekeruhan besi (ferric cassegne).",
    unit: "g/dm³",
    typicalRange: [0.0, 0.8],
  },
  "residual sugar": {
    nameId: "Gula Sisa (Residual Sugar)",
    description: "Kadar gula anggur alami yang tersisa setelah proses fermentasi selesai.",
    layman:
      "Tingkat kemanisan wine. Kurang dari 2 g/L dianggap 'Dry' (tidak manis), di atas 45 g/L dianggap 'Sweet'.",
    impact:
      "Pada White Wine, gula sisa tingkat sedang memberikan keseimbangan sempurna terhadap keasaman tinggi.",
    unit: "g/dm³",
    typicalRange: [0.6, 25.0],
  },
  pH: {
    nameId: "Derajat Keasaman (pH)",
    description: "Skala logaritmik konsentrasi ion hidrogen dalam wine.",
    layman:
      "Indikator keseimbangan rasa asam. Kebanyakan wine berada di pH 3.0 hingga 3.8.",
    impact:
      "pH mengontrol efektivitas sulfur dioksida, warna wine, dan pencegahan kontaminasi bakteri liar.",
    unit: "pH scale",
    typicalRange: [2.8, 3.9],
  },
  "total sulfur dioxide": {
    nameId: "Total Sulfur Dioksida (SO₂)",
    description: "Total SO₂ bebas ditambah SO₂ yang terikat pada molekul lain.",
    layman:
      "Jumlah total zat pelindung wine dari pembusukan dan oksidasi udara.",
    impact:
      "Jika berlebih, menghasilkan aroma belerang tajam menyengat seperti korek api yang baru digesek.",
    unit: "mg/dm³",
    typicalRange: [6.0, 290.0],
  },
  "free sulfur dioxide": {
    nameId: "Sulfur Dioksida Bebas (Free SO₂)",
    description: "Bagian dari SO₂ yang belum terikat dan aktif melindungi wine.",
    layman:
      "Perisai aktif yang siap membunuh bakteri berbahaya secara seketika.",
    impact:
      "Harus dijaga pada level seimbang agar wine tidak mudah basi tetapi juga tidak berbau menyengat.",
    unit: "mg/dm³",
    typicalRange: [2.0, 75.0],
  },
  "fixed acidity": {
    nameId: "Keasaman Tetap (Asam Tartarat)",
    description: "Asam organik utama yang tidak mudah menguap (asam tartarat & malat).",
    layman:
      "Fondasi rasa asam alami dari buah anggur yang memberi struktur kokoh pada rasa wine.",
    impact:
      "Mempengaruhi kesegaran dan umur simpan wine di dalam botol bertahun-tahun.",
    unit: "g(tartaric acid)/dm³",
    typicalRange: [4.0, 15.0],
  },
};
