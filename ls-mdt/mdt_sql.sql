-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 27 Oca 2023, 12:22:54
-- Sunucu sürümü: 10.4.24-MariaDB
-- PHP Sürümü: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `qbcoreframework_ac77c9`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mdt_bolo`
--

CREATE TABLE `mdt_bolo` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mdt_bulletin`
--

CREATE TABLE `mdt_bulletin` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mdt_data`
--

CREATE TABLE `mdt_data` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mdt_incidents`
--

CREATE TABLE `mdt_incidents` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `data` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mdt_report`
--

CREATE TABLE `mdt_report` (
  `id` int(11) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `mdt_bolo`
--
ALTER TABLE `mdt_bolo`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `mdt_bulletin`
--
ALTER TABLE `mdt_bulletin`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `mdt_data`
--
ALTER TABLE `mdt_data`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `mdt_incidents`
--
ALTER TABLE `mdt_incidents`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `mdt_report`
--
ALTER TABLE `mdt_report`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `mdt_bolo`
--
ALTER TABLE `mdt_bolo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `mdt_bulletin`
--
ALTER TABLE `mdt_bulletin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `mdt_data`
--
ALTER TABLE `mdt_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `mdt_incidents`
--
ALTER TABLE `mdt_incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `mdt_report`
--
ALTER TABLE `mdt_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
