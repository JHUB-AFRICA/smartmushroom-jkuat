from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from .services.json_service import JSONService
import os
import re
from datetime import datetime, timezone
from werkzeug.utils import secure_filename
import cloudinary
import cloudinary.api
import cloudinary.uploader
import cloudinary.utils
from dotenv import load_dotenv


def _get_cloudinary_service():
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')
    if not all((cloud_name, api_key, api_secret)):
        return None

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )

    class CloudinaryService:
        def upload_image(self, file, folder):
            try:
                result = cloudinary.uploader.upload(file, folder=f'bridge-ai/{folder}', resource_type='image')
                return {
                    'success': True,
                    'url': result.get('secure_url'),
                    'public_id': result.get('public_id'),
                    'format': result.get('format'),
                    'width': result.get('width'),
                    'height': result.get('height'),
                }
            except Exception as error:
                return {'success': False, 'error': str(error)}

        def upload_resource(self, file, folder='resources'):
            try:
                original_filename = secure_filename(file.filename or 'resource')
                base_name, extension = os.path.splitext(original_filename)
                result = cloudinary.uploader.upload(
                    file,
                    folder=f'bridge-ai/{folder}',
                    resource_type='raw',
                    use_filename=True,
                    unique_filename=True,
                    filename_override=original_filename
                )
                return {
                    'success': True,
                    'url': result.get('secure_url'),
                    'public_id': result.get('public_id'),
                    'format': result.get('format'),
                    'resource_type': result.get('resource_type', 'raw'),
                    'bytes': result.get('bytes'),
                    'original_filename': original_filename,
                    'file_name': original_filename,
                    'file_extension': extension.lstrip('.').lower()
                }
            except Exception as error:
                return {'success': False, 'error': str(error)}

        def delete_image(self, public_id, resource_type='image'):
            try:
                result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
                return {'success': result.get('result') == 'ok', 'result': result.get('result')}
            except Exception as error:
                return {'success': False, 'error': str(error)}

    return CloudinaryService()

api_bp = Blueprint('api', __name__)
json_service = JSONService()
cloudinary_service = _get_cloudinary_service()


def _resource_public_id(resource):
    file_path = resource.get('file_path', '')
    if not file_path.startswith('http'):
        return None

    path = file_path.split('?', 1)[0].split('#', 1)[0]
    marker = '/raw/upload/'
    if marker not in path:
        return None

    public_id = path.split(marker, 1)[1]
    segments = public_id.split('/')
    if segments and re.fullmatch(r'v\d+', segments[0]):
        segments = segments[1:]
    public_id = '/'.join(segments)
    return public_id


def _slugify(value):
    slug = re.sub(r'[^a-z0-9]+', '-', (value or '').lower()).strip('-')
    return slug or 'activity'


def _activity_slug(title, activities, current_id=None):
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2
    while any(item.get('slug') == slug and item.get('id') != current_id for item in activities):
        slug = f'{base_slug}-{suffix}'
        suffix += 1
    return slug


def _event_slug(title, events, current_id=None):
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2
    while any(item.get('slug') == slug and item.get('id') != current_id for item in events):
        slug = f'{base_slug}-{suffix}'
        suffix += 1
    return slug


def _gallery_slug(title, albums, current_id=None):
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2
    while any(item.get('slug') == slug and item.get('id') != current_id for item in albums):
        slug = f'{base_slug}-{suffix}'
        suffix += 1
    return slug


def _resource_slug(title, resources, current_id=None):
    base_slug = _slugify(title)
    slug = base_slug
    suffix = 2
    while any(item.get('slug') == slug and item.get('id') != current_id for item in resources):
        slug = f'{base_slug}-{suffix}'
        suffix += 1
    return slug

# ============================================================
# Admin Login
# ============================================================
@api_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json(silent=True) or {}
    username = data.get('username', '')
    password = data.get('password', '')
    users = json_service.get_all('users.json')
    for user in users:
        password_hash = user.get('password_hash')
        password_matches = (
            check_password_hash(password_hash, password)
            if password_hash
            else user.get('password') == password
        )
        if user.get('username') == username and user.get('is_active', True) and password_matches:
            return jsonify({
                'success': True,
                'user': {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'display_name': user.get('display_name') or user.get('full_name'),
                    'role': user.get('role', 'admin'),
                    'is_active': user.get('is_active', True)
                },
                'message': 'Login successful'
            })
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# ============================================================
# Cloudinary Upload Routes
# ============================================================
@api_bp.route('/upload/<string:module>', methods=['POST'])
def upload_file(module):
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    allowed_modules = ['activities', 'events', 'gallery', 'team', 'resources', 'stories', 'partners']
    if module not in allowed_modules:
        return jsonify({'error': 'Invalid module'}), 400

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    result = cloudinary_service.upload_image(file, folder=module)

    if result['success']:
        return jsonify({
            'success': True,
            'url': result['url'],
            'public_id': result['public_id'],
            'format': result['format'],
            'width': result['width'],
            'height': result['height']
        })
    else:
        return jsonify({
            'success': False,
            'error': result['error']
        }), 500

@api_bp.route('/upload/resource', methods=['POST'])
def upload_resource_file():
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    result = cloudinary_service.upload_resource(file)
    return jsonify(result), 200 if result['success'] else 500

@api_bp.route('/upload/multiple/<string:module>', methods=['POST'])
def upload_multiple_files(module):
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    allowed_modules = ['activities', 'events', 'gallery', 'team', 'resources', 'stories', 'partners']
    if module not in allowed_modules:
        return jsonify({'error': 'Invalid module'}), 400

    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files selected'}), 400

    uploaded = []
    failed = []

    for file in files:
        result = cloudinary_service.upload_image(file, folder=module)
        if result['success']:
            uploaded.append({
                'url': result['url'],
                'public_id': result['public_id'],
                'filename': file.filename
            })
        else:
            failed.append({
                'filename': file.filename,
                'error': result['error']
            })

    return jsonify({
        'success': True,
        'uploaded': uploaded,
        'failed': failed,
        'total': len(files),
        'uploaded_count': len(uploaded),
        'failed_count': len(failed)
    })

@api_bp.route('/upload/delete', methods=['DELETE'])
def delete_file():
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary service is unavailable'}), 503

    data = request.get_json()
    public_id = data.get('public_id')
    resource_type = data.get('resource_type', 'image')

    if not public_id:
        return jsonify({'error': 'public_id is required'}), 400
    if resource_type not in ['image', 'raw', 'video']:
        return jsonify({'error': 'Invalid resource type'}), 400

    result = cloudinary_service.delete_image(public_id, resource_type)
    return jsonify(result)

# ============================================================
# Activities
# ============================================================
@api_bp.route('/activities', methods=['GET'])
def get_activities():
    return jsonify(json_service.get_all('activities.json'))

@api_bp.route('/activities/images', methods=['GET'])
def get_activity_images():
    if cloudinary_service is None:
        return jsonify({'error': 'Cloudinary is not configured on the server'}), 503

    try:
        result = cloudinary.api.resources(
            resource_type='image',
            type='upload',
            prefix='bridge-ai/activities/',
            max_results=100
        )
        images = [
            {
                'public_id': resource.get('public_id'),
                'secure_url': resource.get('secure_url'),
                'created_at': resource.get('created_at')
            }
            for resource in result.get('resources', [])
            if resource.get('secure_url')
        ]
        images.sort(key=lambda image: image.get('created_at') or '', reverse=True)
        return jsonify({'images': images})
    except Exception as error:
        return jsonify({'error': f'Unable to load activity images: {error}'}), 502

@api_bp.route('/activities/<int:id>', methods=['GET'])
def get_activity(id):
    activity = json_service.get_by_id('activities.json', id)
    return jsonify(activity) if activity else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities/<string:slug>', methods=['GET'])
def get_activity_by_slug(slug):
    activities = json_service.get_all('activities.json')
    activity = next((item for item in activities if item.get('slug') == slug), None)
    return jsonify(activity) if activity else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities', methods=['POST'])
def create_activity():
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    activities = json_service.get_all('activities.json')
    data['slug'] = _activity_slug(data.get('slug') or data.get('title'), activities)
    return jsonify(json_service.create('activities.json', data)), 201

@api_bp.route('/activities/<int:id>', methods=['PUT'])
def update_activity(id):
    data = request.get_json() or {}
    activities = json_service.get_all('activities.json')
    data['slug'] = _activity_slug(data.get('slug') or data.get('title'), activities, current_id=id)
    result = json_service.update('activities.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/activities/<int:id>', methods=['DELETE'])
def delete_activity(id):
    return jsonify({'success': True}) if json_service.delete('activities.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Events
# ============================================================
@api_bp.route('/events', methods=['GET'])
def get_events():
    return jsonify(json_service.get_all('events.json'))

@api_bp.route('/events/<int:id>', methods=['GET'])
def get_event(id):
    event = json_service.get_by_id('events.json', id)
    return jsonify(event) if event else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/events/<string:slug>', methods=['GET'])
def get_event_by_slug(slug):
    events = json_service.get_all('events.json')
    event = next((item for item in events if item.get('slug') == slug), None)
    return jsonify(event) if event else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/events', methods=['POST'])
def create_event():
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    events = json_service.get_all('events.json')
    data['slug'] = _event_slug(data.get('slug') or data.get('title'), events)
    return jsonify(json_service.create('events.json', data)), 201

@api_bp.route('/events/<int:id>', methods=['PUT'])
def update_event(id):
    data = request.get_json() or {}
    events = json_service.get_all('events.json')
    data['slug'] = _event_slug(data.get('slug') or data.get('title'), events, current_id=id)
    result = json_service.update('events.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    return jsonify({'success': True}) if json_service.delete('events.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Resources
# ============================================================
@api_bp.route('/resources', methods=['GET'])
def get_resources():
    resources = json_service.get_all('resources.json')
    if request.args.get('is_public') == 'true':
        resources = [resource for resource in resources if str(resource.get('is_public')).lower() == 'true']
    if request.args.get('type'):
        resources = [resource for resource in resources if resource.get('resource_type') == request.args['type']]
    return jsonify(sorted(resources, key=lambda resource: resource.get('display_order', resource.get('id', 0))))

@api_bp.route('/resources/<int:id>', methods=['GET'])
def get_resource(id):
    resource = json_service.get_by_id('resources.json', id)
    return jsonify(resource) if resource else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/resources/<string:slug>', methods=['GET'])
def get_resource_by_slug(slug):
    resources = json_service.get_all('resources.json')
    resource = next((item for item in resources if item.get('slug') == slug), None)
    return jsonify(resource) if resource else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/resources', methods=['POST'])
def create_resource():
    data = request.get_json() or {}
    if not data.get('title') or not data.get('resource_type') or not data.get('wp_tag'):
        return jsonify({'error': 'Title, resource type, and work package are required'}), 400
    resources = json_service.get_all('resources.json')
    data['slug'] = _resource_slug(data.get('slug') or data['title'], resources)
    return jsonify(json_service.create('resources.json', data)), 201

@api_bp.route('/resources/<int:id>', methods=['PUT'])
def update_resource(id):
    data = request.get_json() or {}
    if not data.get('title') or not data.get('resource_type') or not data.get('wp_tag'):
        return jsonify({'error': 'Title, resource type, and work package are required'}), 400
    resources = json_service.get_all('resources.json')
    data['slug'] = _resource_slug(data.get('slug') or data['title'], resources, current_id=id)
    result = json_service.update('resources.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/resources/<int:id>', methods=['DELETE'])
def delete_resource(id):
    return jsonify({'success': True}) if json_service.delete('resources.json', id) else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/resources/<int:id>/download', methods=['POST'])
def increment_resource_download(id):
    resource = json_service.get_by_id('resources.json', id)
    if not resource:
        return jsonify({'error': 'Not found'}), 404
    resource['download_count'] = resource.get('download_count', 0) + 1
    return jsonify(json_service.update('resources.json', id, resource))

@api_bp.route('/resources/<int:id>/file', methods=['GET'])
def get_resource_file(id):
    resource = json_service.get_by_id('resources.json', id)
    if not resource or not resource.get('file_path'):
        return jsonify({'error': 'Resource file not found'}), 404

    public_id = _resource_public_id(resource)
    if not public_id:
        return jsonify({'url': resource['file_path']}), 200

    extension = resource.get('file_extension') or 'bin'
    download = request.args.get('download') == 'true'
    filename = resource.get('file_name') or f"{resource.get('title', 'resource')}.{extension}"
    signed_url = cloudinary.utils.private_download_url(
        public_id,
        format=extension,
        resource_type='raw',
        type='upload',
        attachment=filename if download else False
    )
    return jsonify({'url': signed_url, 'filename': filename, 'download': download})

# ============================================================
# Partners
# ============================================================
@api_bp.route('/partners', methods=['GET'])
def get_partners():
    partners = json_service.get_all('partners.json')
    if request.args.get('is_published') == 'true':
        partners = [partner for partner in partners if str(partner.get('is_published')).lower() == 'true']
    if request.args.get('is_consortium') in ('true', 'false'):
        expected = request.args['is_consortium'] == 'true'
        partners = [partner for partner in partners if str(partner.get('is_consortium')).lower() == str(expected).lower()]
    return jsonify(sorted(partners, key=lambda partner: partner.get('display_order', 0)))

@api_bp.route('/partners/<int:id>', methods=['GET'])
def get_partner(id):
    partner = json_service.get_by_id('partners.json', id)
    return jsonify(partner) if partner else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/partners', methods=['POST'])
def create_partner():
    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({'error': 'Full name is required'}), 400
    data.setdefault('short_name', data['name'])
    data.setdefault('country', '')
    return jsonify(json_service.create('partners.json', data)), 201

@api_bp.route('/partners/<int:id>', methods=['PUT'])
def update_partner(id):
    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({'error': 'Full name is required'}), 400
    data.setdefault('short_name', data['name'])
    data.setdefault('country', '')
    result = json_service.update('partners.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/partners/<int:id>', methods=['DELETE'])
def delete_partner(id):
    return jsonify({'success': True}) if json_service.delete('partners.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Team
# ============================================================
@api_bp.route('/team', methods=['GET'])
def get_team():
    members = json_service.get_all('team.json')
    if request.args.get('is_visible') == 'true':
        members = [member for member in members if str(member.get('is_visible')).lower() == 'true']
    if request.args.get('consent_status'):
        members = [member for member in members if member.get('consent_status') == request.args['consent_status']]
    return jsonify(sorted(members, key=lambda member: member.get('display_order', 0)))

@api_bp.route('/team/<int:id>', methods=['GET'])
def get_team_member(id):
    member = json_service.get_by_id('team.json', id)
    return jsonify(member) if member else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/team', methods=['POST'])
def create_team_member():
    data = request.get_json() or {}
    if not data.get('name') or not data.get('role'):
        return jsonify({'error': 'Name and role are required'}), 400
    return jsonify(json_service.create('team.json', data)), 201

@api_bp.route('/team/<int:id>', methods=['PUT'])
def update_team_member(id):
    data = request.get_json() or {}
    if not data.get('name') or not data.get('role'):
        return jsonify({'error': 'Name and role are required'}), 400
    result = json_service.update('team.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/team/<int:id>', methods=['DELETE'])
def delete_team_member(id):
    return jsonify({'success': True}) if json_service.delete('team.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# Gallery
# ============================================================
@api_bp.route('/gallery', methods=['GET'])
def get_gallery():
    return jsonify(json_service.get_all('gallery.json'))

@api_bp.route('/gallery/<int:id>', methods=['GET'])
def get_gallery_album(id):
    album = json_service.get_by_id('gallery.json', id)
    return jsonify(album) if album else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/gallery/<string:slug>', methods=['GET'])
def get_gallery_album_by_slug(slug):
    albums = json_service.get_all('gallery.json')
    album = next((item for item in albums if item.get('slug') == slug), None)
    return jsonify(album) if album else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/gallery', methods=['POST'])
def create_gallery_album():
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    albums = json_service.get_all('gallery.json')
    data['slug'] = _gallery_slug(data.get('slug') or data.get('title'), albums)
    return jsonify(json_service.create('gallery.json', data)), 201

@api_bp.route('/gallery/<int:id>', methods=['PUT'])
def update_gallery_album(id):
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
    albums = json_service.get_all('gallery.json')
    data['slug'] = _gallery_slug(data.get('slug') or data.get('title'), albums, current_id=id)
    result = json_service.update('gallery.json', id, data)
    return jsonify(result) if result else (jsonify({'error': 'Not found'}), 404)

@api_bp.route('/gallery/<int:id>', methods=['DELETE'])
def delete_gallery_album(id):
    return jsonify({'success': True}) if json_service.delete('gallery.json', id) else (jsonify({'error': 'Not found'}), 404)

# ============================================================
# FAQs
# ============================================================
@api_bp.route('/faqs', methods=['GET'])
def get_faqs():
    return jsonify(json_service.get_all('faqs.json'))

# ============================================================
# Submissions
# ============================================================
@api_bp.route('/submissions', methods=['GET', 'POST'])
def get_submissions():
    if request.method == 'POST':
        data = request.get_json(silent=True) or {}
        if not data.get('name') or not data.get('email') or not data.get('form_type'):
            return jsonify({'error': 'Name, email, and form_type are required'}), 400

        data.setdefault('is_read', False)
        data.setdefault('is_responded', False)
        data['ip_address'] = request.remote_addr
        data['user_agent'] = request.headers.get('User-Agent', '')
        data['submitted_at'] = datetime.now(timezone.utc).isoformat()
        return jsonify(json_service.create('submissions.json', data)), 201

    return jsonify(json_service.get_all('submissions.json'))

@api_bp.route('/submissions/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def manage_submission(id):
    if request.method == 'GET':
        submission = json_service.get_by_id('submissions.json', id)
        return jsonify(submission) if submission else (jsonify({'error': 'Not found'}), 404)

    if request.method == 'DELETE':
        return jsonify({'success': True}) if json_service.delete('submissions.json', id) else (jsonify({'error': 'Not found'}), 404)

    data = request.get_json(silent=True) or {}
    allowed_fields = {'is_read', 'is_responded'}
    if any(field not in allowed_fields for field in data):
        return jsonify({'error': 'Only read and response status can be updated'}), 400

    submission = json_service.get_by_id('submissions.json', id)
    if not submission:
        return jsonify({'error': 'Not found'}), 404
    submission.update(data)
    return jsonify(json_service.update('submissions.json', id, submission))

@api_bp.route('/submissions/clear', methods=['DELETE'])
def clear_submissions():
    json_service.clear('submissions.json')
    return jsonify({'success': True})

# ============================================================
# Shop products
# ============================================================
def _shop_product_payload(data):
    if not isinstance(data, dict):
        return None, 'A product object is required'

    required_fields = ('name', 'category', 'description', 'price', 'unit', 'image')
    if any(not isinstance(data.get(field), str) or not data[field].strip() for field in required_fields if field != 'price'):
        return None, 'Name, category, description, unit, and image are required'

    price = data.get('price')
    if isinstance(price, bool) or not isinstance(price, (int, float)) or price < 0:
        return None, 'Price must be a non-negative number'

    allowed_fields = {'name', 'category', 'description', 'price', 'unit', 'image', 'badge'}
    if set(data) - allowed_fields:
        return None, 'The product contains unsupported fields'
    if 'badge' in data and not isinstance(data['badge'], str):
        return None, 'Badge must be text'

    product = {field: data[field].strip() for field in required_fields if field != 'price'}
    product['price'] = price
    if data.get('badge', '').strip():
        product['badge'] = data['badge'].strip()
    return product, None


@api_bp.route('/shop-products', methods=['GET', 'POST'])
def shop_products():
    if request.method == 'GET':
        return jsonify(json_service.get_all('shopproducts.json'))

    product, error = _shop_product_payload(request.get_json(silent=True))
    if error:
        return jsonify({'error': error}), 400
    return jsonify(json_service.create('shopproducts.json', product)), 201


@api_bp.route('/shop-products/<int:id>', methods=['PUT', 'DELETE'])
def manage_shop_product(id):
    if request.method == 'DELETE':
        return jsonify({'success': True}) if json_service.delete('shopproducts.json', id) else (jsonify({'error': 'Not found'}), 404)

    if not json_service.get_by_id('shopproducts.json', id):
        return jsonify({'error': 'Not found'}), 404
    product, error = _shop_product_payload(request.get_json(silent=True))
    if error:
        return jsonify({'error': error}), 400
    return jsonify(json_service.update('shopproducts.json', id, product))


# ============================================================
# Shop requests
# ============================================================
@api_bp.route('/shop', methods=['GET', 'POST'])
def shop_requests():
    if request.method == 'GET':
        return jsonify(json_service.get_all('shop.json'))

    data = request.get_json(silent=True) or {}
    required_fields = ('full_name', 'phone_number', 'delivery_option', 'items', 'total_amount')
    if any(not data.get(field) for field in required_fields):
        return jsonify({'error': 'Full name, phone number, delivery option, items, and total amount are required'}), 400
    if data['delivery_option'] not in ('pickup', 'courier') or not isinstance(data['items'], list):
        return jsonify({'error': 'Invalid delivery option or order items'}), 400

    data['status'] = 'pending'
    data['submitted_at'] = datetime.now(timezone.utc).isoformat()
    data['ip_address'] = request.remote_addr
    return jsonify(json_service.create('shop.json', data)), 201

@api_bp.route('/shop/<int:id>', methods=['PATCH', 'DELETE'])
def manage_shop_request(id):
    if request.method == 'DELETE':
        return jsonify({'success': True}) if json_service.delete('shop.json', id) else (jsonify({'error': 'Not found'}), 404)

    data = request.get_json(silent=True) or {}
    if set(data) - {'status'} or data.get('status') not in ('pending', 'confirmed', 'fulfilled', 'cancelled'):
        return jsonify({'error': 'Only a valid request status can be updated'}), 400
    shop_request = json_service.get_by_id('shop.json', id)
    if not shop_request:
        return jsonify({'error': 'Not found'}), 404
    shop_request['status'] = data['status']
    shop_request['updated_at'] = datetime.now(timezone.utc).isoformat()
    return jsonify(json_service.update('shop.json', id, shop_request))

# ============================================================
# Challenges
# ============================================================
@api_bp.route('/challenges', methods=['GET'])
def get_challenges():
    return jsonify(json_service.get_all('challenges.json'))

# ============================================================
# Hackathons
# ============================================================
@api_bp.route('/hackathons', methods=['GET'])
def get_hackathons():
    return jsonify(json_service.get_all('hackathons.json'))

# ============================================================
# Success Stories
# ============================================================
@api_bp.route('/success-stories', methods=['GET'])
def get_success_stories():
    return jsonify(json_service.get_all('success_stories.json'))

# ============================================================
# Repositories
# ============================================================
@api_bp.route('/repositories', methods=['GET'])
def get_repositories():
    return jsonify(json_service.get_all('repositories.json'))

# ============================================================
# Community Events
# ============================================================
@api_bp.route('/community-events', methods=['GET'])
def get_community_events():
    return jsonify(json_service.get_all('community_events.json'))

# ============================================================
# Replication Resources
# ============================================================
@api_bp.route('/replication-resources', methods=['GET'])
def get_replication_resources():
    return jsonify(json_service.get_all('replication_resources.json'))

# ============================================================
# Replication Templates
# ============================================================
@api_bp.route('/replication-templates', methods=['GET'])
def get_replication_templates():
    return jsonify(json_service.get_all('replication_templates.json'))

# ============================================================
# Replication Lessons
# ============================================================
@api_bp.route('/replication-lessons', methods=['GET'])
def get_replication_lessons():
    return jsonify(json_service.get_all('replication_lessons.json'))

# ============================================================
# SME Submissions
# ============================================================
@api_bp.route('/sme-submissions', methods=['GET'])
def get_sme_submissions():
    return jsonify(json_service.get_all('sme_submissions.json'))

# ============================================================
# Community Submissions
# ============================================================
@api_bp.route('/community-submissions', methods=['GET'])
def get_community_submissions():
    return jsonify(json_service.get_all('community_submissions.json'))

# ============================================================
# Settings
# ============================================================
@api_bp.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(json_service.get_all('settings.json'))