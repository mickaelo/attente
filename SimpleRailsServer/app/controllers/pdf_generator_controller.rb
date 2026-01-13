require 'prawn'

class PdfGeneratorController < ApplicationController
  protect_from_forgery with: :null_session

  def generate_courrier_pdf
    # patient = fetch_patient_data # Implement this method to fetch patient data
    pdf_path = Rails.root.join('public', 'courrier.pdf') # Set the desired path for the PDF
    
    generate_courrier_pdf_document(params, pdf_path)

    send_file pdf_path, filename: 'courrier.pdf', type: 'application/pdf'
  end

  def fetch_patient_data
    # Replace this with logic to fetch patient data based on your model and requirements
    patient = User.find_by(id: params[:id])
    puts "Name: #{patient.exams.fo.od}"
    if patient
        # Example data structure, adjust based on your actual model structure
        patient
      else
        # Handle the case where the patient is not found
        # You might want to return a default or raise an exception depending on your needs
        {}
      end
  end

  private

  def generate_courrier_pdf_document(patient, pdf_path)
    Prawn::Document.generate(pdf_path, page_size: 'A4', margin: 50) do |pdf|
      generate_header(pdf)
      generate_customer_information(pdf, patient)
      generate_invoice_table(pdf, patient)
      generate_footer(pdf)
    end
  end

  def generate_header(pdf)
    pdf.image Rails.root.join('app', 'assets', 'images', 'logo.png'), at: [30, 790], width: 100
    pdf.fill_color '444444'
    pdf.font_size 14
    pdf.draw_text 'Centre hospitalier de Haguenau', at: [110, 770]
    pdf.font_size 12
    pdf.draw_text '64 Av. du Professeur René Leriche', at: [110, 750]
    pdf.draw_text '67500 Haguenau', at: [140, 730]
  end

  def generate_customer_information(pdf, patient)
    pdf.fill_color '444444'
    pdf.font_size 14
    pdf.draw_text "M. #{patient['firstName']}", at: [50, 600]
    pdf.font_size 14
    pdf.draw_text 'Né le 28/07/1995', at: [50, 580]
  end

  def generate_invoice_table(pdf, patient)
    pdf.font 'Helvetica'
    generate_table_row(pdf, 530, patient)
  end

  def generate_footer(pdf)
    pdf.image Rails.root.join('app', 'assets', 'images', 'signature_sample.png'), at: [300, 100], width: 50
  end

  def generate_table_row(pdf, y, patient)
    pdf.font_size 14
    courrier = <<~COURRIER
        Cher confrère,

        Nous avons vu ce jour M. #{patient['name']}
        Il/Elle a pour principaux antécédents : #{patient['antecedents']}

        Ce jour, l'acuité visuelle est de
        #{patient['measurements']&.dig(0, 'OD_measure', 0)} #{patient['measurements']&.dig(0, 'OD_measure', 1)} #{patient['measurements']&.dig(0, 'OD_measure', 2)} OD et
        #{patient['measurements']&.dig(0, 'OG_measure', 0)} #{patient['measurements']&.dig(0, 'OG_measure', 1)} #{patient['measurements']&.dig(0, 'OG_measure', 2)} OG.

        PIO : #{patient['measurements']&.dig(3, 'OD_measure', 0)} #{patient['measurements']&.dig(3, 'OD_measure', 1)} #{patient['measurements']&.dig(3, 'OD_measure', 2)} OD et
        #{patient['measurements']&.dig(3, 'OG_measure', 0)} #{patient['measurements']&.dig(1, 'OG_measure', 1)} #{patient['measurements']&.dig(1, 'OG_measure', 2)} OG.

        Examen lampe à fente :
        - OD : #{patient['exams']['laf']['od']}
        - OG : #{patient['exams']['laf']['og']}

        Fond d'oeil :
        - OD : #{patient['exams']['fo']['od']}
        - OG : #{patient['exams']['fo']['og']}


        #{patient['description']['courrier']}

        Bien confraternellement,

        Dr Léa Trouvé
        COURRIER
    pdf.text_box courrier, at: [50, y]
  end
end
