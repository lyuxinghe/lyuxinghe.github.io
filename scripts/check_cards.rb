require 'json'
require 'yaml'

# Validate the vocabulary used in archive-entry.json without adding a gem.
def validate(value, schema, path, errors)
  type = schema.fetch('type')
  klass = { 'object' => Hash, 'string' => String, 'integer' => Integer, 'number' => Numeric }.fetch(type)
  unless value.is_a?(klass)
    errors << "#{path}: expected #{type}"
    return
  end
  if type == 'object'
    schema.fetch('required', []).each do |key|
      errors << "#{path}.#{key}: required" unless value.key?(key)
    end
    properties = schema.fetch('properties', {})
    value.each do |key, child|
      if properties.key?(key)
        validate(child, properties.fetch(key), "#{path}.#{key}", errors)
      elsif schema['additionalProperties'] == false
        errors << "#{path}.#{key}: not part of the shared card schema"
      end
    end
  elsif type == 'string'
    errors << "#{path}: must not be blank" if schema['minLength'] && value.strip.length < schema['minLength']
    errors << "#{path}: invalid format" if schema['pattern'] && !Regexp.new(schema['pattern']).match?(value)
  elsif value.is_a?(Numeric)
    errors << "#{path}: must be at least #{schema['minimum']}" if schema['minimum'] && value < schema['minimum']
    errors << "#{path}: must be at most #{schema['maximum']}" if schema['maximum'] && value > schema['maximum']
  end
end

root = File.expand_path(ARGV[0] || '..', __dir__)
schema = JSON.parse(File.read(File.expand_path('../schemas/archive-entry.json', __dir__)))
errors = []
count = 0

%w[publications projects experience].each do |section|
  data = YAML.load_file(File.join(root, '_data', "#{section}.yml"))
  entries = section == 'experience' ? data.fetch('lanes').flat_map { |lane| lane.fetch('organizations') } : data
  ids = []
  entries.each_with_index do |entry, index|
    path = "#{section}[#{index}]"
    validate(entry, schema, path, errors)
    next unless entry.is_a?(Hash)

    id = entry['id']
    errors << "#{path}: duplicate id #{id}" if ids.include?(id)
    ids << id
    card = entry['card']
    image = card['image'] if card.is_a?(Hash)
    errors << "#{path}.card.image: missing file #{image}" if image.is_a?(String) && !File.file?(File.join(root, image))
    count += 1
  end
end

css_files = Dir.glob(File.join(root, '*.css')) + Dir.glob(File.join(root, '_includes/css/**/*.css'))
css_files.each do |file|
  css = File.read(file).gsub(%r{/\*.*?\*/}m, '')
  css.scan(/([^{}]+)\{([^{}]*)\}/m).each do |selector, declarations|
    scoped = selector.match?(/\.card-deck--|\.archive-card--|#(?:publications|projects|experience)\b/)
    changes_card = selector.include?('.archive-card') || declarations.match?(/--card-[\w-]+\s*:/)
    if scoped && changes_card
      errors << "#{File.basename(file)}: use the shared card style, not #{selector.strip}"
    end
  end
end

unless errors.empty?
  warn errors.join("\n")
  exit 1
end
puts "Validated #{count} cards against the shared schema and style rules."
